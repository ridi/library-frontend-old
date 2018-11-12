import axios from 'axios';

export default class API {
  constructor(config) {
    this.http = axios.create();
    this.config = config;
    this.interceptors = [];
  }

  // Request
  get(url) {
    return this.http.get(url, this.config);
  }

  post(url, data) {
    return this.http.post(url, data, this.config);
  }

  put(url, data) {
    return this.http.put(url, data, this.config);
  }

  delete(url) {
    return this.http.delete(url, this.config);
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
