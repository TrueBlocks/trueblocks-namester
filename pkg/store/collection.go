package store

import (
	"github.com/TrueBlocks/trueblocks-namester/pkg/types"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
)

type CollectionKey struct {
	Chain   string       // may be empty
	Address base.Address // may be empty
}

func GetCollectionKey(payload *types.Payload) CollectionKey {
	return CollectionKey{
		Chain:   payload.Chain,
		Address: base.HexToAddress(payload.Address)}
}
