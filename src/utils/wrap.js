
export const wrap = fn => {
  return function(dispatch) {
    return fn(dispatch).catch(error => dispatch({ type: 'ERROR', error }));
  };
};
