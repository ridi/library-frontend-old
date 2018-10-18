
import axios from 'axios';

import createInterceptor from './interceptor';
import API from './api';

import { GET_API } from './actions';

const authorizationInterceptor = {
  response: createInterceptor(null, error => {
    const response = error.response;
    if (response.status === 401) {
      return axios.post('/ridi/token', null, { withCredentials: true })
        .then(() => {
          return axios(response.config);
        })
        .catch(error => {
          if (error.response.status !== 401) {
            console.log('error token refresh');
          }
          return Promise.reject(error);
        });
    }
    return Promise.reject(error);
  })
};


const createApi = context => {
  const { isServer, req } = context;
  
  if (isServer) {
    const { token } = req;
    const api = new API({
      headers: {
        cookie: `ridi-at: ${token};`,
      }
    });
    return api;
  } else {
    const api = new API({ withCredentials: true });
    api.addInterceptor(authorizationInterceptor);
    api.registerInterceptor();

    return api;
  }
};


const createApiMiddleware = context => {
  const api = createApi(context);
  return store => next => action => {
    if (action.type === GET_API) {
      return api;
    }
    
    return next(action);
  };
};


export default createApiMiddleware;
