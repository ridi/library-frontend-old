import { isAfter, subDays } from 'date-fns';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { OrderOptions } from '../../../constants/orderOptions';
import { ServiceType } from '../../../constants/serviceType';
import { UnitType } from '../../../constants/unitType';
import { toDict, toFlatten } from '../../../utils/array';
import { loadBookData, loadUnitOrders } from '../../book/sagas';

import { getBooks, getUnit, getUnitOrders } from '../../book/selectors';
import { HIDE_ALL_EXPIRED_BOOKS, setFetchingReadLatest, setReadLatestBookId, setRecentlyUpdatedData } from './actions';
import { fetchItems, fetchReadLatestBookId } from './requests';
import { getReadLatestData } from './selectors';
import { hideAllExpiredBooks } from './services/hideAllExpiredBooksService';

function getLibraryItem(bookIds, libraryItems) {
  const selectedLibraryItems = bookIds.filter(bookId => !!libraryItems[bookId]);
  return selectedLibraryItems ? libraryItems[selectedLibraryItems[0]] : null;
}

// TODO: 컴포넌트 업데이트 전까지 임시적으로 처리한다.
function getRemainTime(libraryItem) {
  if (!libraryItem) {
    return '';
  }

  if (libraryItem.remain_time !== '') {
    return libraryItem.remain_time;
  }

  if (libraryItem.service_type === ServiceType.RIDISELECT) {
    return '';
  }

  // 사용기간이 있으면
  return libraryItem.expire_date === '9999-12-31T23:59:59+09:00' ? '구매한 책' : '대여했던 책';
}

export function* loadTotalItems(unitId, orderType, orderBy, page, setItems, setTotalCount) {
  yield call(loadUnitOrders, unitId, orderType, orderBy, page);
  const unitOrders = yield select(getUnitOrders, unitId, orderType, orderBy, page);
  const bookIds = toFlatten(unitOrders.items, 'b_ids').reduce((prev, current) => prev.concat(current));
  const libraryItems = toDict((yield call(fetchItems, bookIds)).items.filter(x => !(x.hidden || x.is_deleted)), 'b_id');

  // unitOrders와 libraryItems을 병합해서 재구성한다.
  const items = unitOrders.items.map(unitOrder => {
    const libraryItem = getLibraryItem(unitOrder.b_ids, libraryItems);
    // 구매한 도서가 없으면 b_ids 의 제일 마지막 도서를 선택한다. 첫 도서가 제일 최신일 꺼라고 가정한다.
    const bookId = libraryItem ? libraryItem.b_id : unitOrder.b_ids[0];

    return {
      b_id: bookId,
      expire_date: libraryItem ? libraryItem.expire_date : null,
      purchase_date: libraryItem ? libraryItem.purchase_date : null,
      service_type: libraryItem ? libraryItem.service_type : null,
      is_ridiselect: libraryItem && libraryItem.service_type === ServiceType.RIDISELECT,
      remain_time: libraryItem ? getRemainTime(libraryItem) : '',
    };
  });

  yield all([call(loadBookData, bookIds), put(setItems(items)), put(setTotalCount(unitOrders.total_count))]);
}

export function* isTotalSeriesView(unitId, order) {
  const unit = yield select(getUnit, unitId);
  return UnitType.isSeries(unit.type) && (order === OrderOptions.UNIT_ORDER_ASC.key || order === OrderOptions.UNIT_ORDER_DESC.key);
}

export function* loadRecentlyUpdatedData(bookIds) {
  const books = yield select(getBooks, bookIds);
  const lastBookIds = toFlatten(Object.values(books), 'series.property.last_volume_id', true);
  yield call(loadBookData, lastBookIds);

  const lastBooks = yield select(getBooks, lastBookIds);
  const threeDaysAgo = subDays(new Date(), 3);
  const recentlyUpdatedData = Object.values(lastBooks).reduce((previous, lastBook) => {
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
  const book = yield select(state => state.books.books.get(bookId));
  if (!book.series) {
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
  yield all([takeEvery(HIDE_ALL_EXPIRED_BOOKS, hideAllExpiredBooks)]);
}
