import { getApi } from '../../api';
import config from '../../config';
import { makeURI } from '../../utils/uri';

export async function fetchIsFeatureEnabled(id) {
  const api = getApi();
  const response = await api.get(makeURI(`/tests/u/${id}/check/`, {}, config.LIBRARY_API_BASE_URL));
  return response.data.is_tester;
}
