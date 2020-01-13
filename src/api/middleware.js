import { GET_API, GET_PUBLIC_API } from './actions';
import { getApi, getPublicApi } from './index';

const createApiMiddleware = () => () => next => action => {
  if (action.type === GET_API) {
    return getApi();
  }

  if (action.type === GET_PUBLIC_API) {
    return getPublicApi();
  }

  return next(action);
};

export default createApiMiddleware;
