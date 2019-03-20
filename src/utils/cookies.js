import nookies from 'nookies';

const Cookies = {
  get: (context, key) => {
    const cookies = nookies.get(context);
    return cookies[key];
  },
  set: (context, key, value, options) => {
    nookies.set(context, key, value, options);
  },
  delete: (context, key) => {
    nookies.destroy(context, key);
  },
};

export default Cookies;
