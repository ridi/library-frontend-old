export const GET_API = 'GET_API';
export const GET_PUBLIC_API = 'GET_PUBLIC_API';

export const getAPI = (requestToken = null) => ({
  type: GET_API,
  payload: {
    requestToken,
  },
});

export const getPublicAPI = () => ({
  type: GET_PUBLIC_API,
});
