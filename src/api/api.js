import axios from 'axios';
import { NoMoreRetryError, retry } from '../utils/retry';
import { HttpStatusCode } from './constants';

const _filterNotFound = fn => async (...params) => {
  try {
    return await fn(...params);
  } catch (err) {
    // 응답이 있으면 재시도 하지 않는다. 네트워크 에러만 재시도 한다.
    if (err.response) {
      throw NoMoreRetryError(err);
    }
    throw err;
  }
};

export default class API {
  constructor(withCredentials = false, headers = {}, retryCount = 3, retryDelay = 1000) {
    this.http = axios.create();
    this.withCredentials = withCredentials;
    this.headers = headers;
    this.retryCount = retryCount;
    this.retryDelay = retryDelay;
    this.interceptors = [];
  }

  getRetryOptions() {
    return { retryCount: this.retryCount, retryDelay: this.retryDelay };
  }

  getOptions(headers) {
    return {
      withCredentials: this.withCredentials,
      headers: {
        ...this.headers,
        ...headers,
      },
    };
  }

  // Request
  get(url, headers = {}) {
    return retry(this.getRetryOptions(), _filterNotFound(this.http.get), url, this.getOptions(headers));
  }

  post(url, data, headers = {}) {
    return retry(this.getRetryOptions(), _filterNotFound(this.http.post), url, data, this.getOptions(headers));
  }

  put(url, data, headers = {}) {
    return retry(this.getRetryOptions(), _filterNotFound(this.http.put), url, data, this.getOptions(headers));
  }

  delete(url, headers = {}) {
    return retry(this.getRetryOptions(), _filterNotFound(this.http.delete), url, this.getOptions(headers));
  }

  // Interceptor
  addInterceptors(interceptors) {
    interceptors.forEach(interceptor => this.addInterceptor(interceptor));
  }

  addInterceptor(interceptor) {
    this.interceptors.push(interceptor);
  }

  registerInterceptor() {
    this.interceptors.forEach(interceptor => {
      const _requestInterceptor = interceptor.request;
      const _responseInterceptor = interceptor.response;

      API._bindInterceptor(this.http.interceptors.request, _requestInterceptor);
      API._bindInterceptor(this.http.interceptors.response, _responseInterceptor);
    });
  }

  static _bindInterceptor(target, interceptor) {
    if (!interceptor) {
      return;
    }
    target.use(interceptor.onSuccess, interceptor.onFailure);
  }
}
