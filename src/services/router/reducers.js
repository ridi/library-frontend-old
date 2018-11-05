import { SET_LOCATION, COMMIT_LOCATION, ROLLBACK_LOCATION } from './actions';

const initialState = {
  beforeLocation: null,
  location: {
    pathname: '/',
  },
};

const routerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOCATION:
      return {
        beforeLocation: state.location,
        location: action.payload.location,
      };
    case COMMIT_LOCATION:
      return {
        ...state,
        beforeLocation: null,
      };
    case ROLLBACK_LOCATION:
      return {
        beforeLocation: null,
        location: state.beforeLocation,
      };
    default:
      return state;
  }
};

export default routerReducer;
