export const initialState = {
  // 공용
  filter: {
    options: [
      {
        title: '전체 카테고리',
        value: null,
        hasChildren: false,
        children: null,
      },
    ],
    selected: null,
  },
  order: 0,
  data: {},

  selectedBooks: {},
  isFetchingBooks: false,
};

export const itemState = {
  itemIdsForPage: {},
  items: {},

  page: 1,
  unitTotalCount: 0,
  itemTotalCount: 0,
};
