const createInterceptor = (onSuccess, onFailure) => ({
  onSuccess: data => {
    if (onSuccess) {
      return onSuccess(data);
    }

    return data;
  },
  onFailure: error => {
    if (onFailure) {
      return onFailure(error);
    }
    return error;
  },
});

export default createInterceptor;
