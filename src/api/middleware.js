import { GET_API } from './actions';
import { getApi } from './index';

const createApiMiddleware = () => () => next => action => {
  if (action.type === GET_API) {
    return getApi();
  }

  return next(action);
};

export default createApiMiddleware;
