import { SET_MAINTENANCE } from './actions';
import { initialState } from './state';

const maintenanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MAINTENANCE:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};
export default maintenanceReducer;
