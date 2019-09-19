export const SET_NEED_LOGIN = 'SET_NEED_LOGIN';
export const SET_USER_INFO = 'SET_USER_INFO';

export const setUserInfo = userInfo => ({
  type: SET_USER_INFO,
  payload: {
    userInfo,
  },
});

export const setNeedLogin = () => ({
  type: SET_NEED_LOGIN,
});
