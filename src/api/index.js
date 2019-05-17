import API from './api';
import { authorizationInterceptor, maintenanceInterceptor } from './interceptor';

let api = null;

export const initializeApi = req => {
  if (req != null) {
    const { token } = req;
    return new API(false, { Cookie: `ridi-at=${token};` });
  }

  const withCredentials = true;
  api = new API(withCredentials);
  api.addInterceptors([maintenanceInterceptor, authorizationInterceptor]);
  api.registerInterceptor();
  return api;
};

export const getApi = context => {
  if (api == null) {
    return initializeApi(context && context.req);
  }

  return api;
};
