import JSCookie from 'js-cookie';

const Cookies = {
  get: key => JSCookie.get(key),
  set: (key, value, options) => {
    JSCookie.set(key, value, options);
  },
  delete: key => {
    JSCookie.remove(key);
  },
};

export default Cookies;
