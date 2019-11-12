import produce from 'immer';
import { SET_CATEGORY_FILTER_OPTIONS, SET_SERVICE_TYPE_FILTER_OPTIONS } from './actions';

const initialState = {
  categoryOptions: [
    {
      title: '전체',
      value: null,
      hasChildren: false,
      children: null,
    },
  ],
  serviceTypeOptions: [],
};

const filterReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_CATEGORY_FILTER_OPTIONS:
      draft.categoryOptions = action.payload.categoryFilterOptions;
      break;
    case SET_SERVICE_TYPE_FILTER_OPTIONS:
      draft.serviceTypeOptions = action.payload.serviceTypeFilterOptions;
      break;
    default:
      break;
  }
}, initialState);

export default filterReducer;
