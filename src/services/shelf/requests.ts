import * as R from 'runtypes';

import { getApi } from '../../api';
import config from '../../config';
import { makeURI } from '../../utils/uri';

const RShelfBook = R.Record({
  b_ids: R.Array(R.String),
  unit_id: R.Number,
});

const RShelfItem = R.Record({
  id: R.Number,
  shelf_uuid: R.String,
  name: R.String,
});

const RFetchCountResponse = R.Record({
  count: R.Number,
});

const RFetchShelvesResponse = R.Record({
  items: R.Array(RShelfItem.And(R.Record({ items: R.Array(RShelfBook), count: R.Number }))),
});

const RFetchShelfBooksResponse = R.Record({
  shelf: RShelfItem,
  items: R.Array(RShelfBook),
});

const ROperationStatus = R.Union(R.Literal('undone'), R.Literal('forbidden'), R.Literal('done'));

const RCreateOperationResponse = R.Record({
  operation_ids: R.Array(R.Number),
});

const RFetchOperationStateResponse = R.Record({
  operations_status: R.Array(
    R.Record({
      id: R.Number,
      status: ROperationStatus,
    }),
  ),
});

export async function fetchShelves({ offset, limit, orderType, orderBy }) {
  const api = getApi();
  const response = await api.get(
    makeURI('/shelves/', { offset, limit, need_three_items: true, order_type: orderType, order_by: orderBy }, config.LIBRARY_API_BASE_URL),
  );
  const data = RFetchShelvesResponse.check(response.data);
  return data.items.map(item => ({
    id: item.id,
    uuid: item.shelf_uuid,
    name: item.name,
    thumbnails: item.items,
    bookCount: item.count,
  }));
}

export async function fetchShelfCount() {
  const api = getApi();
  const response = await api.get(makeURI('/shelves/count/', {}, config.LIBRARY_API_BASE_URL));
  const data = RFetchCountResponse.check(response.data);
  return data.count;
}

export async function fetchShelfBooks({ uuid, offset, limit }) {
  const api = getApi();
  const response = await api.get(makeURI(`/shelves/${uuid}/`, { offset, limit }, config.LIBRARY_API_BASE_URL));
  const data = RFetchShelfBooksResponse.check(response.data);
  const items = data.items.map(item => ({
    bookIds: item.b_ids,
    unitId: item.unit_id,
  }));
  const shelfInfo = {
    id: data.shelf.id,
    uuid: data.shelf.shelf_uuid,
    name: data.shelf.name,
  };
  return {
    items,
    shelfInfo,
  };
}

export async function fetchShelfBookCount({ uuid }) {
  const api = getApi();
  const response = await api.get(makeURI(`/shelves/${uuid}/count/`, {}, config.LIBRARY_API_BASE_URL));
  const data = RFetchCountResponse.check(response.data);
  return data.count;
}

export async function createOperation(ops) {
  const api = getApi();
  const payload = {
    operations: ops.map(({ type, revision, uuid, name, unitId, bookIds }) => ({
      action_type: type,
      revision,
      shelf_uuid: uuid,
      shelf_name: name,
      unit_id: unitId,
      b_ids: bookIds,
    })),
  };
  const response = await api.post(makeURI('/shelves/operations/', null, config.LIBRARY_API_BASE_URL), payload);
  const data = RCreateOperationResponse.check(response.data);
  return data.operation_ids;
}

export async function fetchOperationStatus(opIds) {
  const api = getApi();
  const payload = { operation_ids: opIds };
  const response = await api.post(makeURI('/shelves/operations/status/', null, config.LIBRARY_API_BASE_URL), payload);
  const data = RFetchOperationStateResponse.check(response.data);
  return data.operations_status;
}
