import { SET_LOCATION } from './actions';

const initialState = {
  location: {
    pathname: '/',
  },
};

const routerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION:
      return {
        ...state,
        location: action.payload.location,
      };
    default:
      return state;
  }
};

export default routerReducer;
