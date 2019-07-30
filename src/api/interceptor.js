import * as Sentry from '@sentry/browser';
import axios from 'axios';
import config from '../config';
import { URLMap } from '../constants/urls';
import { getMaintenanceStatus } from '../services/maintenance/requests';
import { retry, throwNetworkError } from '../utils/retry';
import { makeLibraryLoginURI } from '../utils/uri';
import { HttpStatusCode } from './constants';

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

export const maintenanceInterceptor = {
  response: createInterceptor(null, async error => {
    const { response } = error;
    if (response.status === HttpStatusCode.HTTP_503_SERVICE_UNAVAILABLE) {
      const maintenanceStatue = await getMaintenanceStatus();
      if (maintenanceStatue.isShow) {
        window.location.reload();
        return null;
      }
    }
    return Promise.reject(error);
  }),
};

export const authorizationInterceptor = {
  response: createInterceptor(null, error => {
    const { response } = error;
    if (!response) {
      // 네트워크 에러가 하나로 묶이도록 fingerprint 수정
      Sentry.withScope(scope => {
        scope.setFingerprint(['network-error']);
        Sentry.captureException(error);
      });
    } else if (response.status === HttpStatusCode.HTTP_401_UNAUTHORIZED) {
      // Token refresh
      Sentry.addBreadcrumb({
        category: 'api',
        message: 'Refreshing token',
        level: Sentry.Severity.Info,
      });
      return retry({ retryCount: 3, retryDelay: 1000 }, throwNetworkError(axios.post), `${config.ACCOUNT_BASE_URL}/ridi/token`, null, {
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
          // 로그인 페이지에서는 진행하지 않는다.
          if (err.response) {
            if (err.response.status === HttpStatusCode.HTTP_401_UNAUTHORIZED) {
              if (!URLMap.login.regex.exec(window.location.pathname)) {
                // 로직을 끊고 가기 위해 location 에 바로 주입한다.
                // Router 를 사용하면 시점이 꼬이게 된다.
                const next = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
                window.location.href = makeLibraryLoginURI(URLMap.login.as, next);
                return null;
              }
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
};
