// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
// === SECTION 1: Imports & Dependencies ===
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GetNamesPage, NamesCrud, Reload } from '@app';
import { Action, BaseTab, usePagination } from '@components';
import { ViewStateKey, useFiltering, useSorting } from '@contexts';
import { toPageDataProp, useActions, useColumns } from '@hooks';
// prettier-ignore
import { DataFacetConfig, useActiveFacet, useEvent, usePayload } from '@hooks';
import { TabView } from '@layout';
import { Group } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { msgs, names, types } from '@models';
import { useErrorHandler } from '@utils';

import { getColumns } from './columns';
import { DEFAULT_FACET, ROUTE, namesFacets } from './facets';

// === END SECTION 1 ===

export const Names = () => {
  // === SECTION 2: Hook Initialization ===
  const createPayload = usePayload();

  const activeFacetHook = useActiveFacet({
    facets: namesFacets,
    defaultFacet: DEFAULT_FACET,
    viewRoute: ROUTE,
  });
  const { availableFacets, getCurrentDataFacet } = activeFacetHook;

  const [pageData, setPageData] = useState<names.NamesPage | null>(null);
  const viewStateKey = useMemo(
    (): ViewStateKey => ({
      viewName: ROUTE,
      tabName: getCurrentDataFacet(),
    }),
    [getCurrentDataFacet],
  );

  const { error, handleError, clearError } = useErrorHandler();
  const { pagination, setTotalItems, goToPage } = usePagination(viewStateKey);
  const { sort } = useSorting(viewStateKey);
  const { filter } = useFiltering(viewStateKey);
  // === END SECTION 2 ===

  // === SECTION 3: Data Fetching Logic ===
  const fetchData = useCallback(async () => {
    clearError();
    try {
      const currentFacet = getCurrentDataFacet();
      const result = await GetNamesPage(
        createPayload(currentFacet),
        pagination.currentPage * pagination.pageSize,
        pagination.pageSize,
        sort,
        filter,
      );
      setPageData(result);
      setTotalItems(result.totalItems || 0);
    } catch (err: unknown) {
      handleError(err, `Failed to fetch ${getCurrentDataFacet()}`);
    }
  }, [
    clearError,
    createPayload,
    getCurrentDataFacet,
    pagination.currentPage,
    pagination.pageSize,
    sort,
    filter,
    setTotalItems,
    handleError,
  ]);

  const currentData = useMemo(() => {
    if (!pageData) return [];

    const facet = getCurrentDataFacet();
    switch (facet) {
      case types.DataFacet.ALL:
        return pageData.names || [];
      case types.DataFacet.CUSTOM:
        return pageData.names || [];
      case types.DataFacet.PREFUND:
        return pageData.names || [];
      case types.DataFacet.REGULAR:
        return pageData.names || [];
      case types.DataFacet.BADDRESS:
        return pageData.names || [];
      default:
        return [];
    }
  }, [pageData, getCurrentDataFacet]);
  // === END SECTION 4 ===

  // === SECTION 4: Event Handling ===
  useEvent(
    msgs.EventType.DATA_LOADED,
    (_message: string, payload?: Record<string, unknown>) => {
      if (payload?.collection === 'names') {
        const eventDataFacet = payload.dataFacet;
        if (eventDataFacet === getCurrentDataFacet()) {
          fetchData();
        }
      }
    },
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReload = useCallback(async () => {
    try {
      Reload(createPayload(getCurrentDataFacet())).then(() => {
        // The data will reload when the DataLoaded event is fired.
      });
    } catch (err: unknown) {
      handleError(err, `Failed to reload ${getCurrentDataFacet()}`);
    }
  }, [getCurrentDataFacet, createPayload, handleError]);

  useHotkeys([['mod+r', handleReload]]);
  // === END SECTION 4 ===

  // === SECTION 6: Actions ===
  const postFunc = useCallback((item: types.Name): types.Name => {
    // EXISTING_CODE
    item = types.Name.createFrom({
      ...item,
      source: item.source || 'TrueBlocks',
    });
    // EXISTING_CODE
    return item;
  }, []);

  // prettier-ignore
  const { handlers, config } = useActions({
    collection: 'names',
    viewStateKey,
    pagination: pagination,
    goToPage: goToPage,
    sort,
    filter,
    enabledActions: ['add', 'publish', 'pin', 'delete', 'remove', 'autoname'],
    pageData,
    setPageData,
    setTotalItems,
    crudFunc: NamesCrud,
    pageFunc: GetNamesPage,
    postFunc,
    pageClass: names.NamesPage,
    updateItem: types.Name.createFrom({}),
    createPayload,
    getCurrentDataFacet,
  });

  const { handleAutoname, handleRemove, handleToggle, handleUpdate } = handlers;

  const headerActions = useMemo(() => {
    if (config.headerActions.length === 0) return null;
    return (
      <Group gap="xs" style={{ flexShrink: 0 }}>
        {config.headerActions.map((action) => {
          const handlerKey =
            `handle${action.type.charAt(0).toUpperCase() + action.type.slice(1)}` as keyof typeof handlers;
          const handler = handlers[handlerKey] as () => void;
          return (
            <Action
              key={action.type}
              icon={
                action.icon as keyof ReturnType<
                  typeof import('@hooks').useIconSets
                >
              }
              onClick={handler}
              title={
                action.requiresWallet && false
                  ? `${action.title} (requires wallet connection)`
                  : action.title
              }
              size="sm"
              isSubdued={action.requiresWallet && false}
            />
          );
        })}
      </Group>
    );
  }, [config.headerActions, handlers]);

  // === END SECTION 6 ===

  // === SECTION 7: Form & UI Handlers ===
  const showActions = getCurrentDataFacet() === types.DataFacet.CUSTOM;
  const getCanRemove = (row: unknown): boolean => {
    return (
      Boolean((row as unknown as types.Name)?.deleted) &&
      getCurrentDataFacet() === types.DataFacet.CUSTOM
    );
  };

  const currentColumns = useColumns(
    getColumns(getCurrentDataFacet()),
    {
      showActions,
      actions: ['delete', 'undelete', 'remove', 'autoname'],
      getCanRemove,
    },
    {
      handleAutoname,
      handleRemove,
      handleToggle,
    },
    toPageDataProp(pageData),
    config,
    true /* perRowCrud */,
  );
  // === END SECTION 7 ===

  // === SECTION 8: Tab Configuration ===
  const perTabContent = useMemo(() => {
    return (
      <BaseTab<Record<string, unknown>>
        data={currentData as unknown as Record<string, unknown>[]}
        columns={currentColumns}
        loading={!!pageData?.isFetching}
        error={error}
        viewStateKey={viewStateKey}
        onSubmit={handleUpdate}
        headerActions={headerActions}
        onDelete={(rowData: Record<string, unknown>) => {
          const address = String(rowData.address || '');
          handleToggle(address);
        }}
        onRemove={(rowData: Record<string, unknown>) => {
          const address = String(rowData.address || '');
          handleRemove(address);
        }}
        onAutoname={(rowData: Record<string, unknown>) => {
          const address = String(rowData.address || '');
          handleAutoname(address);
        }}
      />
    );
  }, [
    currentData,
    currentColumns,
    pageData?.isFetching,
    error,
    handleUpdate,
    viewStateKey,
    headerActions,
    handleToggle,
    handleRemove,
    handleAutoname,
  ]);

  const tabs = useMemo(
    () =>
      availableFacets.map((facetConfig: DataFacetConfig) => ({
        label: facetConfig.label,
        value: facetConfig.id,
        content: perTabContent,
        dividerBefore: facetConfig.dividerBefore,
      })),
    [availableFacets, perTabContent],
  );
  // === END SECTION 8 ===

  // === SECTION 9: Render/JSX ===
  const renderCnt = useRef(0);
  // renderCnt.current++;
  return (
    <div className="mainView">
      <TabView tabs={tabs} route={ROUTE} />
      {error && (
        <div>
          <h3>{`Error fetching ${getCurrentDataFacet()}`}</h3>
          <p>{error.message}</p>
        </div>
      )}
      {renderCnt.current > 0 && <div>{`renderCnt: ${renderCnt.current}`}</div>}
    </div>
  );
  // === END SECTION 9 ===
};

// EXISTING_CODE
// EXISTING_CODE
