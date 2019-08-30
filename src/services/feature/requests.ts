import * as R from 'runtypes';

import { getApi } from '../../api';
import config from '../../config';
import { makeURI } from '../../utils/uri';

const RFeatureCheckResponse = R.Record({
  is_tester: R.Boolean,
});

export async function fetchIsFeatureEnabled(featureId) {
  const api = getApi();
  const response = await api.get(makeURI(`/tests/u/${featureId}/check/`, {}, config.LIBRARY_API_BASE_URL));
  const data = RFeatureCheckResponse.check(response.data);
  return data.is_tester;
}
