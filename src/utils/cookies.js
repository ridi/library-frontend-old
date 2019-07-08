import JSCookies from 'js-cookie';

const Cookies = {
  get: key => JSCookies.get(key),
  set: (key, value, options) => {
    JSCookies.set(key, value, options);
  },
  delete: key => {
    JSCookies.remove(key);
  },
};

export default Cookies;
