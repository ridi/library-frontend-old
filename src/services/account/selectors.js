export const getUserInfo = state => state.account.userInfo;
export const getNeedLogin = state => state.account.needLogin;
export const getAdultVerification = state => Boolean(state.account.userInfo?.is_verified_adult);
