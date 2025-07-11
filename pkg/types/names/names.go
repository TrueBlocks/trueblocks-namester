// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package names

import (
	"fmt"
	"sync"
	"time"

	// EXISTING_CODE
	coreTypes "github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/types"
	// EXISTING_CODE
	"github.com/TrueBlocks/trueblocks-namester/pkg/facets"
	"github.com/TrueBlocks/trueblocks-namester/pkg/logging"
	"github.com/TrueBlocks/trueblocks-namester/pkg/types"
)

const (
	NamesAll      types.DataFacet = "all"
	NamesCustom   types.DataFacet = "custom"
	NamesPrefund  types.DataFacet = "prefund"
	NamesRegular  types.DataFacet = "regular"
	NamesBaddress types.DataFacet = "baddress"
)

func init() {
	types.RegisterDataFacet(NamesAll)
	types.RegisterDataFacet(NamesCustom)
	types.RegisterDataFacet(NamesPrefund)
	types.RegisterDataFacet(NamesRegular)
	types.RegisterDataFacet(NamesBaddress)
}

type NamesCollection struct {
	allFacet      *facets.Facet[Name]
	customFacet   *facets.Facet[Name]
	prefundFacet  *facets.Facet[Name]
	regularFacet  *facets.Facet[Name]
	baddressFacet *facets.Facet[Name]
	summary       types.Summary
	summaryMutex  sync.RWMutex
}

func NewNamesCollection() *NamesCollection {
	c := &NamesCollection{}
	c.ResetSummary()
	c.initializeFacets()
	return c
}

func (c *NamesCollection) initializeFacets() {
	c.allFacet = facets.NewFacet(
		NamesAll,
		isAll,
		isDupName(),
		c.getNamesStore(NamesAll),
		"names",
		c,
	)

	c.customFacet = facets.NewFacet(
		NamesCustom,
		isCustom,
		isDupName(),
		c.getNamesStore(NamesCustom),
		"names",
		c,
	)

	c.prefundFacet = facets.NewFacet(
		NamesPrefund,
		isPrefund,
		isDupName(),
		c.getNamesStore(NamesPrefund),
		"names",
		c,
	)

	c.regularFacet = facets.NewFacet(
		NamesRegular,
		isRegular,
		isDupName(),
		c.getNamesStore(NamesRegular),
		"names",
		c,
	)

	c.baddressFacet = facets.NewFacet(
		NamesBaddress,
		isBaddress,
		isDupName(),
		c.getNamesStore(NamesBaddress),
		"names",
		c,
	)
}

func isAll(item *Name) bool {
	// EXISTING_CODE
	return true
	// EXISTING_CODE
}

func isCustom(item *Name) bool {
	// EXISTING_CODE
	return item.Parts&coreTypes.Custom != 0
	// EXISTING_CODE
}

func isPrefund(item *Name) bool {
	// EXISTING_CODE
	return item.Parts&coreTypes.Prefund != 0
	// EXISTING_CODE
}

func isRegular(item *Name) bool {
	// EXISTING_CODE
	return item.Parts&coreTypes.Regular != 0
	// EXISTING_CODE
}

func isBaddress(item *Name) bool {
	// EXISTING_CODE
	return item.Parts&coreTypes.Baddress != 0
	// EXISTING_CODE
}

func isDupName() func(existing []*Name, newItem *Name) bool {
	// EXISTING_CODE
	return nil
	// EXISTING_CODE
}

func (c *NamesCollection) LoadData(dataFacet types.DataFacet) {
	if !c.NeedsUpdate(dataFacet) {
		return
	}

	go func() {
		switch dataFacet {
		case NamesAll:
			if err := c.allFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case NamesCustom:
			if err := c.customFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case NamesPrefund:
			if err := c.prefundFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case NamesRegular:
			if err := c.regularFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		case NamesBaddress:
			if err := c.baddressFacet.Load(); err != nil {
				logging.LogError(fmt.Sprintf("LoadData.%s from store: %%v", dataFacet), err, facets.ErrAlreadyLoading)
			}
		default:
			logging.LogError("LoadData: unexpected dataFacet: %v", fmt.Errorf("invalid dataFacet: %s", dataFacet), nil)
			return
		}
	}()
}

func (c *NamesCollection) Reset(dataFacet types.DataFacet) {
	switch dataFacet {
	case NamesAll:
		c.allFacet.GetStore().Reset()
	case NamesCustom:
		c.customFacet.GetStore().Reset()
	case NamesPrefund:
		c.prefundFacet.GetStore().Reset()
	case NamesRegular:
		c.regularFacet.GetStore().Reset()
	case NamesBaddress:
		c.baddressFacet.GetStore().Reset()
	default:
		return
	}
}

func (c *NamesCollection) NeedsUpdate(dataFacet types.DataFacet) bool {
	switch dataFacet {
	case NamesAll:
		return c.allFacet.NeedsUpdate()
	case NamesCustom:
		return c.customFacet.NeedsUpdate()
	case NamesPrefund:
		return c.prefundFacet.NeedsUpdate()
	case NamesRegular:
		return c.regularFacet.NeedsUpdate()
	case NamesBaddress:
		return c.baddressFacet.NeedsUpdate()
	default:
		return false
	}
}

func (c *NamesCollection) GetSupportedFacets() []types.DataFacet {
	return []types.DataFacet{
		NamesAll,
		NamesCustom,
		NamesPrefund,
		NamesRegular,
		NamesBaddress,
	}
}

func (c *NamesCollection) AccumulateItem(item interface{}, summary *types.Summary) {
	// EXISTING_CODE
	if name, ok := item.(*Name); ok {
		c.summaryMutex.Lock()
		defer c.summaryMutex.Unlock()

		c.summary.TotalCount++
		if c.summary.FacetCounts == nil {
			c.summary.FacetCounts = make(map[types.DataFacet]int)
		}
		if name.Parts&coreTypes.Custom != 0 {
			c.summary.FacetCounts[NamesCustom]++
		}
		if name.Parts&coreTypes.Prefund != 0 {
			c.summary.FacetCounts[NamesPrefund]++
		}
		if name.Parts&coreTypes.Regular != 0 {
			c.summary.FacetCounts[NamesRegular]++
		}
		if name.Parts&coreTypes.Baddress != 0 {
			c.summary.FacetCounts[NamesBaddress]++
		}
		c.summary.LastUpdated = time.Now().Unix()
	}
	// EXISTING_CODE
}

func (c *NamesCollection) GetSummary() types.Summary {
	c.summaryMutex.RLock()
	defer c.summaryMutex.RUnlock()

	summary := c.summary
	summary.FacetCounts = make(map[types.DataFacet]int)
	for k, v := range c.summary.FacetCounts {
		summary.FacetCounts[k] = v
	}

	if c.summary.CustomData != nil {
		summary.CustomData = make(map[string]interface{})
		for k, v := range c.summary.CustomData {
			summary.CustomData[k] = v
		}
	}

	return summary
}

func (c *NamesCollection) ResetSummary() {
	c.summaryMutex.Lock()
	defer c.summaryMutex.Unlock()
	c.summary = types.Summary{
		TotalCount:  0,
		FacetCounts: make(map[types.DataFacet]int),
		CustomData:  make(map[string]interface{}),
		LastUpdated: time.Now().Unix(),
	}
}

// EXISTING_CODE
// EXISTING_CODE
