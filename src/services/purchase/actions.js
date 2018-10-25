export const LOAD_PURCHASE_ITEMS = 'LOAD_PURCHASE_ITEMS';

export const SET_PURCHASE_ITEMS = 'SET_PURCHASE_ITEMS';
export const CHANGE_PURCHASE_PAGE = 'CHANGE_PURCHASE_PAGE';
export const CHANGE_PURCHASE_OPTION = 'CHANGE_PURCHASE_OPTION';

export const setPurchaseItems = items => ({
  type: SET_PURCHASE_ITEMS,
  paylaod: {
    items,
  },
});

export const changePurchasePage = page => ({
  type: CHANGE_PURCHASE_PAGE,
  payload: {
    page,
  },
});

export const changePurchaseOption = (key, value) => ({
  type: CHANGE_PURCHASE_OPTION,
  payload: {
    key,
    value,
  },
});
