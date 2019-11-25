export const SELECT_ITEMS = 'SELECT_ITEMS';
export const UNSELECT_ITEMS = 'UNSELECT_ITEMS';
export const TOGGLE_ITEM = 'TOGGLE_ITEM';
export const CLEAR_SELECTED_ITEMS = 'CLEAR_SELECTED_ITEMS';

export const selectItems = ids => ({
  type: SELECT_ITEMS,
  payload: ids,
});

export const unselectItems = ids => ({
  type: UNSELECT_ITEMS,
  payload: ids,
});

export const toggleItem = id => ({
  type: TOGGLE_ITEM,
  payload: id,
});

export const clearSelectedItems = () => ({
  type: CLEAR_SELECTED_ITEMS,
});
