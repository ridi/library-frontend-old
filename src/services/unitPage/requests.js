import { put } from 'redux-saga/effects';
import { getAPI } from '../../api/actions';
import config from '../../config';
import { OrderOptions, OrderType } from '../../constants/orderOptions';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../constants/page';
import { PageType } from '../../constants/urls';
import { calcOffset } from '../../utils/pagination';
import { attatchTTL } from '../../utils/ttl';
import { makeURI } from '../../utils/uri';
import { getRemainTime } from './utils';

function enhanceOptions(options, orderType, orderBy) {
  if (orderType === OrderType.EXPIRED_BOOKS_ONLY) {
    options.expiredBooksOnly = true;
  } else {
    options.orderType = orderType;
    options.orderBy = orderBy;
  }
}

export function* fetchUnitItems({ kind, unitId, orderType, orderBy, page }) {
  const options = {
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };

  if (kind !== PageType.HIDDEN) {
    enhanceOptions(options, orderType, orderBy);
  }

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/${kind}/${unitId}`, options, config.LIBRARY_API_BASE_URL));
  if (response.data.items) {
    response.data.items = response.data.items.map(item => ({
      ...item,
      purchased: true,
      remain_time: getRemainTime(item),
    }));
  }
  return response.data;
}

export function* fetchUnitItemsTotalCount({ kind, unitId, orderType, orderBy }) {
  const options = {};

  if (kind !== PageType.HIDDEN) {
    enhanceOptions(options, orderType, orderBy);
  }

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/${kind}/${unitId}/count`, options, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* getUnitPrimaryItem({ kind, unitId }) {
  const options = {
    offset: 0,
    limit: 1,
  };

  if (kind !== PageType.HIDDEN) {
    enhanceOptions(options, OrderOptions.PURCHASE_DATE.orderType, OrderOptions.PURCHASE_DATE.orderBy);
  }

  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/${kind}/${unitId}`, options, config.LIBRARY_API_BASE_URL));
  return attatchTTL(response.data.items)[0];
}
