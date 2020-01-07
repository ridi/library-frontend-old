import API from './api';
import { createAuthorizationInterceptor, createMaintenanceInterceptor } from './interceptor';

let api = null;

export const initializeApi = (req, store) => {
  if (req != null) {
    const { token } = req;
    api = new API(false, { Cookie: `ridi-at=${token};` });
    return api;
  }

  const withCredentials = true;
  api = new API(withCredentials);
  api.addInterceptors([createAuthorizationInterceptor(store), createMaintenanceInterceptor(store)]);
  api.registerInterceptor();
  return api;
};

export const getApi = context => {
  if (api == null) {
    return initializeApi(context && context.req);
  }

  return api;
};

let publicApi = null;

export const initializePublicApi = store => {
  publicApi = new API();
  publicApi.addInterceptors([createMaintenanceInterceptor(store)]);
  publicApi.registerInterceptor();

  return publicApi;
};

export const getPublicApi = () => {
  if (publicApi == null) {
    return initializePublicApi();
  }

  return publicApi;
};
