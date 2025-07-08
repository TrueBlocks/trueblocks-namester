// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
import { SetInitialized } from '@app';
import { DalleDress, Home, Khedra, Settings } from '@views';
import { Names } from '@views';
import { Wizard } from '@wizards';

export interface MenuItem {
  label: string;
  path: string;
  position: 'top' | 'bottom' | 'hidden';
  component?: React.ComponentType;
  hotkey?: string;
  altHotkey?: string;
  type?: 'navigation' | 'dev' | 'toggle';
  action?: () => void | Promise<void>;
}

export const MenuItems: MenuItem[] = [
  {
    label: 'Home',
    path: '/',
    position: 'top',
    component: Home,
    hotkey: 'mod+1',
    altHotkey: 'alt+1',
    type: 'navigation',
  },
  {
    label: 'Names',
    path: '/names',
    position: 'top',
    component: Names,
    hotkey: 'mod+2',
    altHotkey: 'alt+2',
    type: 'navigation',
  },
  {
    label: 'DalleDress',
    path: '/dalledress',
    position: 'top',
    component: DalleDress,
    hotkey: 'mod+3',
    altHotkey: 'alt+3',
    type: 'navigation',
  },
  {
    label: 'Khedra',
    path: '/khedra',
    position: 'bottom',
    component: Khedra,
    hotkey: 'mod+4',
    altHotkey: 'alt+4',
    type: 'navigation',
  },
  {
    label: 'Settings',
    path: '/settings',
    position: 'bottom',
    component: Settings,
    hotkey: 'mod+5',
    altHotkey: 'alt+5',
    type: 'navigation',
  },
  {
    path: '/wizard',
    label: 'Wizard',
    position: 'hidden',
    component: Wizard,
    hotkey: 'mod+shift+w',
    type: 'dev',
    action: async () => {
      await SetInitialized(false);
    },
  },
];
