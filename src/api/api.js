
export default class API {
  constructor(http) {
    this.http = http;
    this.interceptors = [];
  }

  // Request
  get(url) {
    return this.http.get(url);
  }
  post(url, data) {
    return this.http.post(url, data);
  }
  put(url, data) {
    return this.http.put(url, data);
  }
  delete(url) {
    return this.http.delete(url);
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

      this._bindInterceptor(this.http.interceptors.request, _requestInterceptor);
      this._bindInterceptor(this.http.interceptors.response, _responseInterceptor);
    });
  }

  _bindInterceptor(target, interceptor) {
    if (!interceptor) {
      return;
    }
    target.use(interceptor.onSuccess, interceptor.onFailure);
  }
}
