import produce from 'immer';
import { COMMIT_LOCATION, ROLLBACK_LOCATION, SET_LOCATION } from './actions';

const initialState = {
  beforeLocation: null,
  location: {
    pathname: '/',
  },
};

const routerReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_LOCATION:
      draft.beforeLocation = draft.location;
      draft.location = action.payload.location;
      break;
    case COMMIT_LOCATION:
      draft.beforeLocation = null;
      break;
    case ROLLBACK_LOCATION:
      draft.beforeLocation = null;
      draft.location = draft.beforeLocation;
      break;
    default:
      break;
  }
}, initialState);

export default routerReducer;
