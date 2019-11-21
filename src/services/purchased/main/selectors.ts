import createCachedSelector from 're-reselect';
import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { toFlatten } from '../../../utils/array';
import { calcPage } from '../../../utils/pagination';
import { getBooks } from '../../book/selectors';
import { createInitialDataState, mapPageOptionsToKey } from './state';

const getDataState = createCachedSelector(
  (state: any) => state.purchasedMain.data,
  (_, pageOptions) => mapPageOptionsToKey(pageOptions),
  (data, key) => data[key] || createInitialDataState(),
)((_, pageOptions) => mapPageOptionsToKey(pageOptions));

export const getItems = createSelector(getDataState, dataState => dataState.items);

export const getItemsByPage = createCachedSelector(
  getDataState,
  (_, pageOptions) => pageOptions.page,
  (dataState, page) => {
    const { itemIdsForPage, items } = dataState;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
)((_, pageOptions) => pageOptions.page);

const getBookIdsByPage = createSelector(getItemsByPage, items => toFlatten(items, 'b_id'));

const getBooksByPage = (state: any, pageOptions) => getBooks(state, getBookIdsByPage(state, pageOptions));

export const getUnitIdsByPage = createSelector(getItemsByPage, items => toFlatten(items, 'unit_id'));

export const getLastBookIdsByPage = createSelector(getBooksByPage, books =>
  toFlatten(Object.values(books), 'series.property.opened_last_volume_id', true),
);

export const getTotalPages = createSelector(getDataState, dataState => calcPage(dataState.unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE));

export const getIsPageCold = createCachedSelector(
  getDataState,
  (_, pageOptions) => pageOptions.page,
  (dataState, page) => dataState.itemIdsForPage[page] == null,
)((_, pageOptions) => pageOptions.page);
