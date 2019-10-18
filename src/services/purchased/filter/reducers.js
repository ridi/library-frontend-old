import { SET_FILTER_OPTIONS } from './actions';

const initialState = {
  options: [
    {
      title: '전체 카테고리',
      value: null,
      hasChildren: false,
      children: null,
    },
  ],
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER_OPTIONS:
      return {
        options: action.payload.filterOptions,
      };
    default:
      return state;
  }
};

export default filterReducer;
