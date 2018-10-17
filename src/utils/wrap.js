
export const wrap = fn => {
  return function(dispatch) {
    return fn(dispatch);
  };
};
