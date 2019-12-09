import * as Sentry from '@sentry/browser';
import axios from 'axios';

import { ENV } from 'constants/environment';

import config from '../config';
import * as accountActions from '../services/account/actions';
import * as maintenanceAction from '../services/maintenance/actions';
import { getMaintenanceStatus } from '../services/maintenance/requests';
import { retry, throwNetworkError } from '../utils/retry';
import { HttpStatusCode } from './constants';

const { ENVIRONMENT: environment } = config;
const timeout = environment === ENV.PRODUCTION || environment === ENV.STAGING ? 15000 : 60000;
axios.defaults.timeout = timeout;

const createInterceptor = (onSuccess, onFailure) => ({
  onSuccess: data => {
    if (onSuccess) {
      return onSuccess(data);
    }

    return data;
  },
  onFailure: error => {
    if (onFailure) {
      return onFailure(error);
    }
    return error;
  },
});

export const createMaintenanceInterceptor = store => ({
  response: createInterceptor(null, async error => {
    const { response } = error;
    if (response) {
      const { status, data } = response;
      if (status === HttpStatusCode.HTTP_503_SERVICE_UNAVAILABLE && data.status === 'maintenance') {
        const maintenanceStatus = await getMaintenanceStatus();
        if (maintenanceStatus.visible) {
          store.dispatch(maintenanceAction.setMaintenance(maintenanceStatus));
          return null;
        }
      }
    }
    return Promise.reject(error);
  }),
});

export const createAuthorizationInterceptor = store => ({
  response: createInterceptor(null, error => {
    const { response } = error;
    if (!response) {
      // 네트워크 에러가 하나로 묶이도록 fingerprint 수정
      Sentry.withScope(scope => {
        scope.setFingerprint(['network-error']);
        if (error.request != null) {
          scope.setExtra('url', error.request.url);
          scope.setExtra('baseURL', error.request.baseURL);
          scope.setExtra('method', error.request.method);
        }
        Sentry.captureException(error);
      });
    } else if (response.status === HttpStatusCode.HTTP_401_UNAUTHORIZED) {
      // Token refresh
      Sentry.addBreadcrumb({
        category: 'api',
        message: 'Refreshing token',
        level: Sentry.Severity.Info,
      });
      return retry({ retryCount: 3, retryDelay: 1000 }, throwNetworkError(axios.post), `${config.ACCOUNT_BASE_URL}ridi/token`, null, {
        withCredentials: true,
      })
        .then(() => {
          Sentry.addBreadcrumb({
            category: 'api',
            message: 'Retrying original request',
            level: Sentry.Severity.Info,
            data: {
              method: response.config.method,
              url: new URL(response.config.url, response.config.baseURL).toString(),
            },
          });
          return axios(response.config); // 원래 요청 재시도
        })
        .catch(err => {
          // Token Refresh를 시도했는데 실패 했으면 로그인페이지로 이동한다.
          if (err.response) {
            if (err.response.status === HttpStatusCode.HTTP_401_UNAUTHORIZED) {
              store.dispatch(accountActions.setNeedLogin());
            }
          } else if (err.request) {
            // 네트워크 에러가 하나로 묶이도록 fingerprint 수정
            Sentry.withScope(scope => {
              scope.setFingerprint(['network-error']);
              Sentry.captureException(err);
            });
          } else {
            Sentry.captureException(err);
          }

          return Promise.reject(err);
        });
    }
    return Promise.reject(error);
  }),
});
