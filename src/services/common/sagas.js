import { call } from 'redux-saga/effects';

import { BooksPageKind } from 'constants/urls';

import { requestGetBookIdsByUnitIds, requestGetBookIdsByUnitIdsForHidden } from './requests';

const _reduceSelectedBookIds = (items, selectedBookIds) =>
  selectedBookIds.reduce(
    (previous, bookId) => {
      const item = items[bookId];
      if (item.unit_count === 1) {
        previous.bookIds.push(item.b_id);
      } else {
        previous.unitIds.push(item.unit_id);
      }
      return previous;
    },
    { bookIds: [], unitIds: [] },
  );

const _flattenBookIds = bookIdsInUnitData =>
  Object.keys(bookIdsInUnitData).reduce((previous, key) => {
    const _bookIds = bookIdsInUnitData[key];
    return [...previous, ..._bookIds];
  }, []);

export function* getBookIdsByUnitIds(unitIds, pageOptions) {
  const bookIdsInUnitData = yield call(requestGetBookIdsByUnitIds, unitIds, pageOptions);
  return _flattenBookIds(bookIdsInUnitData);
}

export function* getBookIdsByItems(items, selectedBookIds, pageOptions) {
  const { bookIds, unitIds } = _reduceSelectedBookIds(items, selectedBookIds);
  const bookIdsInUnitData = yield call(getBookIdsByUnitIds, unitIds, pageOptions);
  const bookIdsInUnit = pageOptions.kind === BooksPageKind.HIDDEN ? _flattenBookIds(bookIdsInUnitData) : bookIdsInUnitData;

  return [...bookIds, ...bookIdsInUnit];
}

export function* getBookIdsByUnitIdsForHidden(items, selectedBookIds) {
  const { bookIds, unitIds } = _reduceSelectedBookIds(items, selectedBookIds);
  const bookIdsInUnitData = yield call(requestGetBookIdsByUnitIdsForHidden, unitIds);
  const bookIdsInUnit = _flattenBookIds(bookIdsInUnitData);

  return [...bookIds, ...bookIdsInUnit];
}
