import nookies from 'nookies';

export const CookieKey = {
  // 기존에 VIEW_TYPE을 저장하기 위해 사용하던 키를 actions에서 가져와서 사용했기 때문에 하위호환을 위해 그대로 유지한다.
  VIEW_TYPE: 'SET_VIEW_TYPE',
};

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
