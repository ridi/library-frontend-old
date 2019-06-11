import { SET_PROMPT, UNSET_PROMPT } from './actions';
import { initialState } from './state';

const promptReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROMPT:
      return action.payload.prompt;
    case UNSET_PROMPT:
      return null;
    default:
      return state;
  }
};

export default promptReducer;
