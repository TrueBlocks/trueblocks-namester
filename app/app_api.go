// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */

package app

// EXISTING_CODE
import (
	"github.com/TrueBlocks/trueblocks-namester/pkg/types"
	"github.com/TrueBlocks/trueblocks-namester/pkg/types/names"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
)

// EXISTING_CODE

func (a *App) Reload(payload *types.Payload) error {
	lastView := a.GetAppPreferences().LastView

	switch lastView {
	case "/names":
		return a.ReloadNames(payload)
	}

	return nil
}

// EXISTING_CODE
func (a *App) NameFromAddress(address string) (*names.Name, bool) {
	collection := names.GetNamesCollection(&types.Payload{})
	return collection.NameFromAddress(base.HexToAddress(address))
}

// EXISTING_CODE
