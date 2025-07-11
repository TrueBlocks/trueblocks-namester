package store

import (
	"errors"
	"fmt"
	"sync"
	"sync/atomic"

	"github.com/TrueBlocks/trueblocks-namester/pkg/logging"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/output"
)

type StoreState int

const (
	StateStale    StoreState = iota // Needs refresh
	StateFetching                   // Currently loading
	StateLoaded                     // Complete data
	StateError                      // Error occurred
	StateCanceled                   // User canceled
)

type FacetObserver[T any] interface {
	OnNewItem(item *T, index int)
	OnStateChanged(state StoreState, reason string)
}

type MappingFunc[T any] func(item *T) (key interface{}, includeInMap bool)

// Store handle the low-level data fetching and streaming from external systems
type Store[T any] struct {
	data               []*T
	observers          []FacetObserver[T]
	queryFunc          func(renderCtx *output.RenderCtx) error
	processFunc        func(rawItem interface{}) *T
	mappingFunc        MappingFunc[T]
	dataMap            *map[interface{}]*T
	contextKey         string // Key for ContextManager
	state              StoreState
	stateReason        string
	expectedTotalItems atomic.Int64
	dataGeneration     atomic.Uint64
	mutex              sync.RWMutex
}

var errStaleFetch = errors.New("stale fetch: store was reset")

func ErrStaleFetch() error {
	return errStaleFetch
}

// NewStore creates a new SDK-based store
func NewStore[T any](
	contextKey string,
	queryFunc func(*output.RenderCtx) error,
	processFunc func(interface{}) *T,
	mappingFunc MappingFunc[T],
) *Store[T] {
	s := &Store[T]{
		data:        make([]*T, 0),
		observers:   make([]FacetObserver[T], 0),
		queryFunc:   queryFunc,
		processFunc: processFunc,
		mappingFunc: mappingFunc,
		contextKey:  contextKey,
		state:       StateStale,
	}
	if mappingFunc != nil {
		tempMap := make(map[interface{}]*T)
		s.dataMap = &tempMap
	}
	s.expectedTotalItems.Store(0)
	s.dataGeneration.Store(0)
	return s
}

func (s *Store[T]) RegisterObserver(observer FacetObserver[T]) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	for _, obs := range s.observers {
		if obs == observer {
			return
		}
	}

	if s.observers == nil {
		s.observers = make([]FacetObserver[T], 0)
	}

	s.observers = append(s.observers, observer)
}

func (s *Store[T]) UnregisterObserver(observer FacetObserver[T]) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	for i, obs := range s.observers {
		if obs == observer {
			lastIndex := len(s.observers) - 1
			s.observers[i] = s.observers[lastIndex]
			s.observers = s.observers[:lastIndex]
			return
		}
	}
}

func (s *Store[T]) ChangeState(expectedGeneration uint64, newState StoreState, reason string) {
	s.mutex.Lock()
	if expectedGeneration != 0 && (newState == StateLoaded || newState == StateError) {
		if s.dataGeneration.Load() != expectedGeneration {
			s.mutex.Unlock()
			return
		}
	}

	s.state = newState
	s.stateReason = reason

	currentObservers := make([]FacetObserver[T], len(s.observers))
	copy(currentObservers, s.observers)
	stateToSend := s.state
	messageToSend := s.stateReason
	s.mutex.Unlock()

	for _, observer := range currentObservers {
		observer.OnStateChanged(stateToSend, messageToSend)
	}
}

func (s *Store[T]) GetState() StoreState {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return s.state
}

func (s *Store[T]) MarkStale(reason string) {
	s.ChangeState(0, StateStale, reason)
}

func (s *Store[T]) GetItem(index int) *T {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	if index < 0 || index >= len(s.data) {
		return nil
	}
	return s.data[index]
}

func (s *Store[T]) ExpectedTotalItems() int64 {
	return s.expectedTotalItems.Load()
}

func (s *Store[T]) GetContextKey() string {
	return s.contextKey
}

func (s *Store[T]) GetItemFromMap(key interface{}) (*T, bool) {
	s.mutex.RLock()
	defer s.mutex.RUnlock()

	if s.dataMap == nil {
		return nil, false
	}

	item, found := (*s.dataMap)[key]
	return item, found
}

func (s *Store[T]) GetItems() []*T {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	result := make([]*T, len(s.data))
	copy(result, s.data)
	return result
}

func (s *Store[T]) Count() int {
	s.mutex.RLock()
	defer s.mutex.RUnlock()
	return len(s.data)
}

func (s *Store[T]) Fetch() error {
	fetchGeneration := s.dataGeneration.Load()
	s.ChangeState(fetchGeneration, StateFetching, "Starting data fetch")

	renderCtx := RegisterContext(s.contextKey)
	done := make(chan struct{})
	errChan := make(chan error, 1)
	var processingError error

	go func() {
		defer logging.Silence()()
		defer close(done)
		if s.queryFunc != nil {
			err := s.queryFunc(renderCtx)
			if err != nil {
				errChan <- err
				return
			}
		}
	}()

	modelChanClosed := false
	errorChanClosed := false

	for !modelChanClosed || !errorChanClosed {
		select {
		case item, ok := <-renderCtx.ModelChan:
			if !ok {
				modelChanClosed = true
				if errorChanClosed && processingError == nil {
					s.ChangeState(fetchGeneration, StateLoaded, "Data loaded successfully")
				}
				continue
			}

			itemPtr := s.processFunc(item)
			if itemPtr == nil {
				continue
			}

			s.mutex.Lock()
			if s.dataGeneration.Load() != fetchGeneration {
				s.mutex.Unlock()
				return errStaleFetch
			}

			if s.mappingFunc != nil {
				key, includeInMap := s.mappingFunc(itemPtr)
				if includeInMap {
					if s.dataMap == nil {
						tempMap := make(map[interface{}]*T)
						s.dataMap = &tempMap
					}
					if existingItem, ok := (*s.dataMap)[key]; ok {
						logging.LogBackend(fmt.Sprintf("Store.Fetch: Overwriting item in dataMap for key key %s existing_item %v new_item %v", key, existingItem, itemPtr))
					}
					(*s.dataMap)[key] = itemPtr
				}
			}

			s.data = append(s.data, itemPtr)
			s.expectedTotalItems.Store(int64(len(s.data)))
			index := len(s.data) - 1
			currentObservers := make([]FacetObserver[T], len(s.observers))
			copy(currentObservers, s.observers)
			s.mutex.Unlock()

			for _, obs := range currentObservers {
				s.mutex.RLock()
				if index < len(s.data) {
					itemToSend := s.data[index]
					s.mutex.RUnlock()
					obs.OnNewItem(itemToSend, index)
				} else {
					s.mutex.RUnlock()
				}
			}

		case streamErr, ok := <-renderCtx.ErrorChan:
			if !ok {
				errorChanClosed = true
				if modelChanClosed && processingError == nil {
					s.ChangeState(fetchGeneration, StateLoaded, "Data loaded successfully")
				}
				continue
			}
			processingError = streamErr
			s.ChangeState(fetchGeneration, StateError, streamErr.Error())

		case err := <-errChan:
			processingError = err
			s.ChangeState(fetchGeneration, StateError, err.Error())
			return processingError

		case <-done:
			// Don't change state here - let the channel processing handle final state
			// This ensures we've fully processed both ModelChan and ErrorChan
			continue

		case <-renderCtx.Ctx.Done():
			s.ChangeState(0, StateCanceled, "User cancelled operation")
			return renderCtx.Ctx.Err()
		}
	}
	return processingError
}

func (s *Store[T]) AddItem(item *T, index int) {
	s.mutex.Lock()
	s.data = append(s.data, item)
	newIndex := len(s.data) - 1
	itemPtr := s.data[newIndex]

	if s.mappingFunc != nil {
		if key, include := s.mappingFunc(itemPtr); include {
			if s.dataMap == nil {
				tempMap := make(map[interface{}]*T)
				s.dataMap = &tempMap
			}
			(*s.dataMap)[key] = itemPtr
		}
	}

	observers := make([]FacetObserver[T], len(s.observers))
	copy(observers, s.observers)
	s.mutex.Unlock()

	for _, observer := range observers {
		observer.OnNewItem(itemPtr, newIndex)
	}
}

func (s *Store[T]) GetExpectedTotal() int {
	return int(s.expectedTotalItems.Load())
}

func (s *Store[T]) Reset() {
	s.mutex.Lock()
	UnregisterContext(s.contextKey)

	s.data = make([]*T, 0)
	if s.dataMap != nil {
		newMap := make(map[interface{}]*T)
		s.dataMap = &newMap
	}
	s.expectedTotalItems.Store(0)
	s.dataGeneration.Add(1)
	newState := StateStale
	reason := "Store reset"
	s.mutex.Unlock()

	s.ChangeState(0, newState, reason)
}

func (s *Store[T]) UpdateData(updateFunc func(data []*T) []*T) {
	s.mutex.Lock()
	defer s.mutex.Unlock()

	s.data = updateFunc(s.data)
	s.expectedTotalItems.Store(int64(len(s.data)))

	if s.dataMap != nil && s.mappingFunc != nil {
		newMap := make(map[interface{}]*T)
		for _, item := range s.data {
			key, includeInMap := s.mappingFunc(item)
			if includeInMap {
				newMap[key] = item
			}
		}
		s.dataMap = &newMap
	}
}
