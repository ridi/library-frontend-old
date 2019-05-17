import { GET_API } from './actions';
import { getApi } from './index';

const createApiMiddleware = context => {
  const api = getApi(context);

  return () => next => action => {
    if (action.type === GET_API) {
      return api;
    }

    return next(action);
  };
};

export default createApiMiddleware;
