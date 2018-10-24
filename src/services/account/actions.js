export const LOAD_USER_INFO = 'LOAD_USER_INFO';
export const SET_USER_INFO = 'SET_USER_INFO';

export const loadUserInfo = () => ({
  type: LOAD_USER_INFO,
});

export const setUserInfo = userInfo => ({
  type: SET_USER_INFO,
  payload: {
    userInfo: userInfo.result,
  },
});
