import { getApi } from '../../../api';
import config from '../../../config';
import { OrderType } from '../../../constants/orderOptions';
import { BooksPageKind } from '../../../constants/urls';
import { calcOffset } from '../../../utils/pagination';
import { makeURI } from '../../../utils/uri';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';

export async function fetchMainItems({ kind, keyword, orderType, orderBy, categoryFilter, page }) {
  const options = {
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };
  if (kind === BooksPageKind.MAIN) {
    options.category = categoryFilter;
  } else if (kind === BooksPageKind.SEARCH) {
    options.keyword = keyword;
  }

  if (orderType === OrderType.EXPIRED_BOOKS_ONLY) {
    options.expiredBooksOnly = true;
  } else {
    options.orderType = orderType;
    options.orderBy = orderBy;
  }

  const api = getApi();
  let data = { items: [] };
  try {
    const response = await api.get(makeURI(`/items/${kind}/`, options, config.LIBRARY_API_BASE_URL));
    ({ data } = response);
  } catch (err) {
    // 잘못된 Keyword는 별도의 에러핸들링이 아닌 Empty페이지 처리
    if (kind !== BooksPageKind.SEARCH || err.response?.status !== 400) {
      throw err;
    }
  }
  return data;
}

export async function fetchMainItemsTotalCount({ kind, keyword, orderType, orderBy, categoryFilter }) {
  const options = {};

  if (kind === BooksPageKind.MAIN) {
    options.category = categoryFilter;
    if (orderType === OrderType.EXPIRED_BOOKS_ONLY) {
      options.expiredBooksOnly = true;
    } else {
      options.orderType = orderType;
      options.orderBy = orderBy;
    }
  } else if (kind === BooksPageKind.SEARCH) {
    options.keyword = keyword;
  }

  const api = getApi();
  let data = {
    unit_total_count: 0,
    item_total_count: 0,
  };
  try {
    const response = await api.get(makeURI(`/items/${kind}/count/`, options, config.LIBRARY_API_BASE_URL));
    ({ data } = response);
  } catch (err) {
    // 잘못된 Keyword는 별도의 에러핸들링이 아닌 Empty페이지 처리
    if (kind !== BooksPageKind.SEARCH || err.response?.status !== 400) {
      throw err;
    }
  }
  return data;
}
