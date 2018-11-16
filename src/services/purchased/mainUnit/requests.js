import { put } from 'redux-saga/effects';
import { stringify } from 'qs';

import config from '../../../config';
import { snakelize } from '../../../utils/snakelize';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';

export function* fetchPurchasedUnitItems(unitId, orderType, orderBy, filter, page) {
  const options = snakelize({
    orderType,
    orderBy,
    filter,
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  });

  const api = yield put(getAPI());
  const response = yield api.get(`${config.LIBRARY_API_BASE_URL}/items/${unitId}?${stringify(options)}`);

  return response.data;
}

export function* fetchPurchasedUnitItemsTotalCount(unitId, orderType, orderBy, filter) {
  const options = snakelize({ orderType, orderBy, filter });

  const api = yield put(getAPI());
  const response = yield api.get(`${config.LIBRARY_API_BASE_URL}/items/${unitId}/count?${stringify(options)}`);
  return response.data;
}

const _createFilterOption = (title, value, hasChildren) => ({ title, value, hasChildren });

const _reformatCategories = categories =>
  categories.reduce(
    (previous, value) => {
      const hasChildren = value.children && value.children.length > 0;
      const filterOption = _createFilterOption(value.name, value.id, hasChildren);
      filterOption.children = hasChildren ? _reformatCategories(value.children) : null;

      previous.push(filterOption);
      return previous;
    },
    [_createFilterOption('전체 카테고리', '')],
  );
