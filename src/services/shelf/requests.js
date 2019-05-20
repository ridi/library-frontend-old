import { getApi } from '../../api';
import config from '../../config';
import { makeURI } from '../../utils/uri';

export async function fetchShelves({ offset, limit }) {
  const api = getApi();
  const response = await api.get(makeURI('/shelves/', { offset, limit }, config.LIBRARY_API_BASE_URL));
  return response.data.items.map(item => ({
    id: item.id,
    uuid: item.shelf_uuid,
    name: item.name,
  }));
}

export async function fetchShelfCount() {
  const api = getApi();
  const response = await api.get(makeURI('/shelves/count/', {}, config.LIBRARY_API_BASE_URL));
  return response.data.count;
}

export async function fetchShelfBooks({ uuid, offset, limit }) {
  const api = getApi();
  const response = await api.get(makeURI(`/shelves/${uuid}/`, { offset, limit }, config.LIBRARY_API_BASE_URL));
  const items = response.data.items.map(item => ({
    bookIds: item.b_ids,
    unitId: item.unit_id,
  }));
  const shelfInfo = {
    id: response.data.shelf.id,
    uuid: response.data.shelf.shelf_uuid,
    name: response.data.shelf.name,
  };
  return {
    items,
    shelfInfo,
  };
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
  return response.data.operation_ids;
}

export async function fetchOperationStatus(opIds) {
  const api = getApi();
  const payload = { operation_ids: opIds };
  const response = await api.post(makeURI('/shelves/operations/status/', null, config.LIBRARY_API_BASE_URL), payload);
  return response.data.operations_status;
}
