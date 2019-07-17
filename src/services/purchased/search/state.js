export const initialState = {
  data: {},
  isFetchingBooks: false,
};

export const createInitialDataState = () => ({
  itemIdsForPage: {},
  items: {},

  unitTotalCount: 0,
  itemTotalCount: 0,
});

export function mapPageOptionsToKey(pageOptions) {
  return pageOptions.keyword;
}
