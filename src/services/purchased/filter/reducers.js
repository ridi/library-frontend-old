import produce from 'immer';
import { SET_ALL_CATEGORY_COUNT, SET_CATEGORY_FILTER_OPTIONS, SET_SERVICE_TYPE_FILTER_OPTIONS } from './actions';

const initialState = {
  allCategoryOption: {
    title: '전체',
    value: null,
    count: 0,
  },
  categoryOptions: null,
  serviceTypeOptions: null,
};

const filterReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_ALL_CATEGORY_COUNT:
      draft.allCategoryOption.count = action.payload.count;
      break;
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
