export const GET_API = 'GET_API';

export const getAPI = (includeCsrfToken = false) => ({
  type: GET_API,
  payload: {
    includeCsrfToken,
  },
});
