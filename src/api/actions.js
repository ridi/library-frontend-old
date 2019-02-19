export const GET_API = 'GET_API';

export const getAPI = (requestToken = null) => ({
  type: GET_API,
  payload: {
    requestToken,
  },
});
