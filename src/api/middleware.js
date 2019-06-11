import { GET_API } from './actions';
import { initializeApi } from './index';

const createApiMiddleware = context => {
  const api = initializeApi(context && context.req);

  return () => next => action => {
    if (action.type === GET_API) {
      return api;
    }

    return next(action);
  };
};

export default createApiMiddleware;
