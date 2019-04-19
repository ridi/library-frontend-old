import { isAfter, subDays } from 'date-fns';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';
import { toFlatten } from '../../../../utils/array';
import { loadBookData } from '../../../book/sagas';
import { getBooks } from '../../../book/selectors';
import { CONFIRM_HIDE_ALL_EXPIRED_BOOKS, setFetchingReadLatest, setReadLatestBookId, setRecentlyUpdatedData } from '../actions';
import { fetchReadLatestBookId } from '../requests';
import { getReadLatestData } from '../selectors';
import { confirmHideAllExpiredBooks } from './hideAllExpiredBooksSagas';

export function* loadRecentlyUpdatedData(bookIds) {
  const books = yield select(getBooks, bookIds);
  const openedBooks = Object.values(books).filter(book => book.property.is_open);
  const lastBookIds = toFlatten(openedBooks, 'series.property.opened_last_volume_id', true);
  yield call(loadBookData, lastBookIds);

  const lastBooks = yield select(getBooks, lastBookIds);
  const threeDaysAgo = subDays(new Date(), 3);
  const recentlyUpdatedData = Object.values(lastBooks).reduce((previous, lastBook) => {
    if (!lastBook || !lastBook.publish) {
      return previous;
    }

    if (lastBook.publish.ridibooks_publish) {
      previous[lastBook.id] = isAfter(lastBook.publish.ridibooks_publish, threeDaysAgo);
    } else {
      previous[lastBook.id] = false;
    }
    return previous;
  }, {});

  yield put(setRecentlyUpdatedData(recentlyUpdatedData));
}

export function* loadReadLatestBookId(unitId, bookId) {
  yield call(loadBookData, [bookId]);
  const book = yield select(state => state.books.books.get(bookId));
  if (!book || !book.series || !book.support || !book.support.web_viewer) {
    return;
  }

  const existReadLatest = yield select(getReadLatestData, unitId);
  const seriesId = book.series.id;
  yield put(setFetchingReadLatest(existReadLatest ? !existReadLatest.loaded : true));
  try {
    const readLatestBookId = yield call(fetchReadLatestBookId, seriesId);
    yield put(setReadLatestBookId(unitId, readLatestBookId));
  } catch (err) {
    yield put(setReadLatestBookId(unitId, null));
  } finally {
    yield put(setFetchingReadLatest(false));
  }
}

export default function* purchasedCommonRootSaga() {
  yield all([takeEvery(CONFIRM_HIDE_ALL_EXPIRED_BOOKS, confirmHideAllExpiredBooks)]);
}
