import { put } from 'redux-saga/effects';

import config from '../../../config';
import { snakelize } from '../../../utils/snakelize';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { makeURI } from '../../../utils/uri';

export function* fetchMainItems(orderType, orderBy, filter, page) {
  const options = snakelize({
    orderType,
    orderBy,
    category: filter,
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  });

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/main', options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchMainItemsTotalCount(orderType, orderBy, filter) {
  const options = snakelize({ orderType, orderBy, category: filter });

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/main/count', options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

const _createFilterOption = (title, value, hasChildren) => ({
  title,
  value,
  hasChildren,
});

const _reformatCategories = categories =>
  categories.reduce(
    (previous, value) => {
      const hasChildren = value.children && value.children.length > 0;
      const filterOption = _createFilterOption(value.name, value.id, hasChildren);
      filterOption.children = hasChildren ? _reformatCategories(value.children) : null;

      previous.push(filterOption);
      return previous;
    },
    [_createFilterOption('전체 카테고리', null)],
  );

export function* fetchPurchaseCategories() {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/categories', {}, config.LIBRARY_API_BASE_URL));
  return _reformatCategories(response.data.categories);
}
