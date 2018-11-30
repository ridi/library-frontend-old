import axios from 'axios';

import createInterceptor from './interceptor';
import API from './api';

import config from '../config';
import { GET_API } from './actions';
import { HttpStatusCode } from './constants';

const authorizationInterceptor = {
  response: createInterceptor(null, error => {
    const { response } = error;
    if (response.status === HttpStatusCode.HTTP_401_UNAUTHORIZED) {
      return axios
        .post(`${config.ACCOUNT_BASE_URL}/ridi/token`, null, {
          withCredentials: true,
        })
        .then(() => axios(response.config)) // 원래 요청 재시도
        .catch(err => {
          if (err.response.status === HttpStatusCode.HTTP_401_UNAUTHORIZED) {
            // TODO: Add Redirecting To Authorization URL
            return null;
          }

          console.log('error token refresh');
          return Promise.reject(err);
        });
    }
    return Promise.reject(error);
  }),
};

const createApi = context => {
  const { isServer, req } = context;

  if (isServer) {
    const { token } = req;
    const api = new API({
      headers: {
        Cookie: `ridi-at=${token};`,
      },
    });
    return api;
  }

  const api = new API({ withCredentials: true });
  api.addInterceptor(authorizationInterceptor);
  api.registerInterceptor();

  return api;
};

const createApiMiddleware = context => {
  const api = createApi(context);
  return () => next => action => {
    if (action.type === GET_API) {
      return api;
    }

    return next(action);
  };
};

export default createApiMiddleware;
