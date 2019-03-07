import { all, call, put, select } from 'redux-saga/effects';
import { OrderOptions } from '../../../constants/orderOptions';
import { ServiceType } from '../../../constants/serviceType';
import { UnitType } from '../../../constants/unitType';
import { toDict, toFlatten } from '../../../utils/array';
import { loadBookData, loadUnitOrders } from '../../book/sagas';
import { getUnit, getUnitOrders } from '../../book/selectors';
import { fetchItems } from './requests';

function getLibraryItem(bookIds, libraryItems) {
  const selectedLibraryItems = bookIds.filter(bookId => !!libraryItems[bookId]);
  return selectedLibraryItems ? libraryItems[selectedLibraryItems[0]] : null;
}

export function* loadTotalItems(unitId, orderType, orderBy, page, setItems, setTotalCount) {
  yield call(loadUnitOrders, unitId, orderType, orderBy, page);
  const unitOrders = yield select(getUnitOrders, unitId, orderType, orderBy, page);
  const bookIds = toFlatten(unitOrders.items, 'b_ids').reduce((prev, current) => prev.concat(current));
  const libraryItems = toDict((yield call(fetchItems, bookIds)).items, 'b_id');

  // unitOrders와 libraryItems을 병합해서 재구성한다.
  const items = unitOrders.items.map(unitOrder => {
    const libraryItem = getLibraryItem(unitOrder.b_ids, libraryItems);
    // 구매한 도서가 없으면 b_ids 의 제일 마지막 도서를 선택한다. 마지막 도서가 제일 최신일 꺼라고 가정한다.
    const bookId = libraryItem ? libraryItem.b_id : unitOrder.b_ids[unitOrder.b_ids.length - 1];
    return {
      b_id: bookId,
      expire_date: libraryItem ? libraryItem.expire_date : '9999-12-31T23:59:59+09:00',
      purchase_date: libraryItem ? libraryItem.purchase_date : '9999-12-31T23:59:59+09:00',
      service_type: libraryItem ? libraryItem.service_type : ServiceType.NORMAL,
      remain_time: libraryItem ? libraryItem.remain_time : '',
    };
  });

  yield all([call(loadBookData, [bookIds]), put(setItems(items)), put(setTotalCount(unitOrders.length))]);
}

export function* isTotalSeriesView(unitId, order) {
  const unit = yield select(getUnit, unitId);
  return UnitType.isSeries(unit.type) && (order === OrderOptions.UNIT_ORDER_ASC.key || order === OrderOptions.UNIT_ORDER_DESC.key);
}
