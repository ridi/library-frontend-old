import * as R from 'runtypes';

import { getApi } from '../../api';
import config from '../../config';
import { makeURI } from '../../utils/uri';
import { OperationStatus } from './constants';

const RShelfBook = R.Record({
  b_ids: R.Array(R.String),
  unit_id: R.Number,
});

const RShelf = R.Record({
  id: R.Number,
  shelf_uuid: R.String,
  name: R.String,
});

const RShelfItem = R.Record({
  items: R.Array(RShelfBook),
  count: R.Number,
});

const RFetchCountResponse = R.Record({
  count: R.Number,
});

const RFetchShelvesResponse = R.Record({
  items: R.Array(RShelf.And(RShelfItem)),
});

const RFetchShelfBooksResponse = R.Record({
  shelf: RShelf,
  items: R.Array(RShelfBook),
});

const ROperationStatus = R.Union(
  R.Literal(OperationStatus.UNDONE),
  R.Literal(OperationStatus.FORBIDDEN),
  R.Literal(OperationStatus.FAILURE),
  R.Literal(OperationStatus.DONE),
);

const RFetchOperationStatusResponse = R.Record({
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

export async function createOperationShelf(ops) {
  const api = getApi();
  const payload = {
    operations: ops.map(({ type, revision, uuid, name }) => ({
      action_type: type,
      revision,
      shelf_uuid: uuid,
      shelf_name: name,
    })),
  };
  const response = await api.post(makeURI('/operations/shelves/', null, config.LIBRARY_API_BASE_URL), payload);
  const data = RFetchOperationStatusResponse.check(response.data);
  return data.operations_status;
}

export async function createOperationShelfItem(ops) {
  const api = getApi();
  const payload = {
    operations: ops.map(({ type, revision, uuid, unitId, bookIds }) => ({
      action_type: type,
      revision,
      shelf_uuid: uuid,
      unit_id: unitId,
      b_ids: bookIds,
    })),
  };
  const response = await api.post(makeURI('/operations/shelves/books/', null, config.LIBRARY_API_BASE_URL), payload);
  const data = RFetchOperationStatusResponse.check(response.data);
  return data.operations_status;
}

export async function fetchOperationStatus(opIds) {
  const api = getApi();
  const payload = { operation_ids: opIds };
  const response = await api.post(makeURI('/shelves/operations/status/', null, config.LIBRARY_API_BASE_URL), payload);
  const data = RFetchOperationStatusResponse.check(response.data);
  return data.operations_status;
}
