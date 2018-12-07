import axios from 'axios';

import createInterceptor from './interceptor';
import API from './api';

import config from '../config';
import { GET_API } from './actions';
import { HttpStatusCode } from './constants';

import { makeLoginURI } from '../utils/uri';
import Window, { LOCATION } from '../utils/window';

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
            const _location = Window.get(LOCATION);
            const currentURI = _location.href;
            const loginURI = makeLoginURI(config.RIDI_TOKEN_AUTHORIZE_URL, config.RIDI_OAUTH2_CLIENT_ID, currentURI);
            _location.href = loginURI;
            return null;
          }

          // TODO: Add Sentry
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
