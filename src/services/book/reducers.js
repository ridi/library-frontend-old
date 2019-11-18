import produce from 'immer';

import { isExpiredTTL } from '../../utils/ttl';
import {
  makeUnitOrderKey,
  SET_BOOK_DATA,
  SET_BOOK_DATA_FROM_STORAGE,
  SET_BOOK_DESCRIPTIONS,
  SET_BOOK_STAR_RATINGS,
  SET_OPEN_INFO,
  SET_UNIT_DATA,
  SET_UNIT_ORDERS,
} from './actions';

const makeEntries = entries => entries.map(entry => ({ key: entry.id, value: entry }));
const compareWithTTL = (oldValue, newValue) => oldValue.ttl < newValue.ttl;

const THRESHOLD = 200000;
const initialState = {
  books: {},
  bookDescriptions: {},
  bookStarRatings: {},
  units: {},
  unitOrders: {},
  openInfo: {},
};

function update(container, entries) {
  entries.forEach(entry => {
    if (!(entry.key in container) || compareWithTTL(container[entry.key], entry.value)) {
      container[entry.key] = entry.value;
    }
  });
  if (Object.keys(container).length > THRESHOLD) {
    const expired = Object.entries(container)
      .filter(([, entry]) => isExpiredTTL(entry))
      .map(([id]) => id);
    expired.forEach(id => {
      delete container[id];
    });
  }
}

const bookReducer = produce((draft, action) => {
  switch (action.type) {
    case SET_BOOK_DATA:
      update(draft.books, makeEntries(action.payload.books));
      break;
    case SET_BOOK_DESCRIPTIONS:
      update(draft.bookDescriptions, makeEntries(action.payload.bookDescriptions));
      break;
    case SET_BOOK_STAR_RATINGS:
      update(draft.bookStarRatings, makeEntries(action.payload.bookStarRatings));
      break;
    case SET_UNIT_DATA:
      update(draft.units, makeEntries(action.payload.units));
      break;
    case SET_UNIT_ORDERS:
      const key = makeUnitOrderKey(action.payload.unitId, action.payload.orderType, action.payload.orderBy, action.payload.page);
      update(draft.unitOrders, [{ key, value: action.payload.unitOrders }]);
      break;
    case SET_BOOK_DATA_FROM_STORAGE:
      draft.books = action.payload.books;
      draft.units = action.payload.units;
      break;
    case SET_OPEN_INFO:
      update(draft.openInfo, makeEntries(action.payload.openInfo));
      break;
    default:
      break;
  }
}, initialState);

export default bookReducer;
