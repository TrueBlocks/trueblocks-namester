import { lazy } from 'react';

export const LazyNamesPanel = lazy(() =>
  import('./panels/NamesPanel').then((module) => ({
    default: module.NamesPanel,
  })),
);
