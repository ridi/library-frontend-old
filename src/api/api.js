import axios from 'axios';
import { retry } from '../utils/retry';

export default class API {
  constructor(config, retryCount = 3, retryDelay = 1000) {
    this.http = axios.create();
    this.config = config;
    this.retryCount = retryCount;
    this.retryDelay = retryDelay;
    this.interceptors = [];
  }

  getRetryOptions() {
    return { retryCount: this.retryCount, retryDelay: this.retryDelay };
  }

  // Request
  get(url) {
    return retry(this.getRetryOptions(), this.http.get, url, this.config);
  }

  post(url, data) {
    return retry(this.getRetryOptions(), this.http.post, url, data, this.config);
  }

  put(url, data) {
    return retry(this.getRetryOptions(), this.http.put, url, data, this.config);
  }

  delete(url) {
    return retry(this.getRetryOptions(), this.http.delete, url, this.config);
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
