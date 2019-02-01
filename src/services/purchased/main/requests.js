import { put } from 'redux-saga/effects';

import config from '../../../config';
import { OrderType } from '../../../constants/orderOptions';
import { calcOffset } from '../../../utils/pagination';
import { getAPI } from '../../../api/actions';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { makeURI } from '../../../utils/uri';

export function* fetchMainItems(orderType, orderBy, filter, page) {
  const options = {
    category: filter,
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };

  if (orderType === OrderType.EXPIRED_BOOKS_ONLY) {
    options.expiredBooksOnly = true;
  } else {
    options.orderType = orderType;
    options.orderBy = orderBy;
  }

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/main', options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* fetchMainItemsTotalCount(orderType, orderBy, filter) {
  const options = { category: filter };

  if (orderType === OrderType.EXPIRED_BOOKS_ONLY) {
    options.expiredBooksOnly = true;
  } else {
    options.orderType = orderType;
    options.orderBy = orderBy;
  }

  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/main/count', options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

const _createFilterOption = (title, value, count = 0, hasChildren = false) => ({
  title,
  value,
  count,
  hasChildren,
});

const _reformatCategories = categories =>
  categories.reduce((previous, value) => {
    const hasChildren = value.children && value.children.length > 0;
    const filterOption = _createFilterOption(value.name, value.id, value.count, hasChildren);
    filterOption.children = hasChildren ? _reformatCategories(value.children) : null;

    previous.push(filterOption);
    return previous;
  }, []);

const _countAllCategory = categories => categories.reduce((previous, value) => previous + value.count, 0);

export function* fetchPurchaseCategories() {
  const api = yield put(getAPI());
  const response = yield api.get(makeURI('/items/categories', {}, config.LIBRARY_API_BASE_URL));
  return [
    _createFilterOption('전체 카테고리', null, _countAllCategory(response.data.categories)),
    ..._reformatCategories(response.data.categories),
  ];
}
