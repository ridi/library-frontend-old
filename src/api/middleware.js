import Router from 'next/router';
import axios from 'axios';
import { URLMap } from '../constants/urls';

import createInterceptor from './interceptor';
import API from './api';

import config from '../config';
import { GET_API } from './actions';
import { HttpStatusCode } from './constants';

import Window, { LOCATION } from '../utils/window';

const authorizationInterceptor = {
  response: createInterceptor(null, error => {
    const { response } = error;
    if (response.status === HttpStatusCode.HTTP_401_UNAUTHORIZED) {
      // Token refresh
      return axios
        .post(`${config.ACCOUNT_BASE_URL}/ridi/token`, null, {
          withCredentials: true,
        })
        .then(() => axios(response.config)) // 원래 요청 재시도
        .catch(err => {
          // Token Refresh를 시도했는데 실패 했으면 로그인페이지로 이동한다.
          // 로그인 페이지에서는 진행하지 않는다.
          if (Window.get(LOCATION).pathname !== URLMap.login.href && err.response.status === HttpStatusCode.HTTP_401_UNAUTHORIZED) {
            Router.replace(URLMap.login.href, URLMap.login.as);
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
    return new API(false, { Cookie: `ridi-at=${token};` });
  }

  const withCredentials = true;
  const api = new API(withCredentials);

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
