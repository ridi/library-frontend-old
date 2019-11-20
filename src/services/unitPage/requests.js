import { put } from 'redux-saga/effects';

import { OrderOptions } from 'constants/orderOptions';
import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from 'constants/page';
import { PageType } from 'constants/urls';
import { getOrderParams } from 'utils/order';
import { calcOffset } from 'utils/pagination';
import { attatchTTL } from 'utils/ttl';
import { makeURI } from 'utils/uri';

import { getAPI } from '../../api/actions';
import config from '../../config';
import { getRemainTime } from './utils';

function getQuery(initalParams, kind, orderBy, orderDirection) {
  if (kind !== PageType.HIDDEN) {
    return {
      ...initalParams,
      ...getOrderParams(orderBy, orderDirection),
    };
  }

  return initalParams;
}

export function* fetchUnitItems({ kind, unitId, orderBy, orderDirection, page }) {
  const initialParams = {
    offset: calcOffset(page, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    limit: LIBRARY_ITEMS_LIMIT_PER_PAGE,
  };

  const query = getQuery(initialParams, kind, orderBy, orderDirection);
  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/${kind}/${unitId}`, query, config.LIBRARY_API_BASE_URL));
  if (response.data.items) {
    response.data.items = response.data.items.map(item => ({
      ...item,
      purchased: true,
      remain_time: getRemainTime(item),
    }));
  }
  return response.data;
}

export function* fetchUnitItemsTotalCount({ kind, unitId, orderBy, orderDirection }) {
  const query = getQuery({}, kind, orderBy, orderDirection);
  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/${kind}/${unitId}/count`, query, config.LIBRARY_API_BASE_URL));
  return response.data;
}

export function* getUnitPrimaryItem({ kind, unitId }) {
  const initialParams = {
    offset: 0,
    limit: 1,
  };
  const { orderBy, orderDirection } = OrderOptions.PURCHASE_DATE;
  const query = getQuery(initialParams, kind, orderBy, orderDirection);
  const api = yield put(getAPI());
  const response = yield api.get(makeURI(`/items/${kind}/${unitId}`, query, config.LIBRARY_API_BASE_URL));
  return attatchTTL(response.data.items)[0];
}
