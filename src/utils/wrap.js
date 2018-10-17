
export default function wrap (fn) {
  return function(dispatch) {
    return fn(dispatch);
  };
};
