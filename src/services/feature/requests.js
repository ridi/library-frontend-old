import { getApi } from '../../api';
import config from '../../config';
import { makeURI } from '../../utils/uri';

export async function fetchIsFeatureEnabled(featureId) {
  const api = getApi();
  const response = await api.get(makeURI(`/tests/u/${featureId}/check/`, {}, config.LIBRARY_API_BASE_URL));
  return response.data.is_tester;
}
