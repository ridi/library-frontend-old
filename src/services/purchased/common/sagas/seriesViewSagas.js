import { all, call, put, select } from 'redux-saga/effects';
import { OrderOptions } from '../../../../constants/orderOptions';
import { ServiceType } from '../../../../constants/serviceType';
import { UnitType } from '../../../../constants/unitType';
import { toDict, toFlatten } from '../../../../utils/array';
import { loadBookData, loadUnitOrders } from '../../../book/sagas';
import { getUnit, getUnitOrders, getBooks } from '../../../book/selectors';
import { fetchItems } from '../requests';

function getLibraryItem(itemBookIds, libraryItems) {
  const selectedLibraryItems = itemBookIds.filter(bookId => !!libraryItems[bookId]);
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

export function getOpendBookId(itemBookIds, pageBookData) {
  const opendBookId = itemBookIds.find(bookId => pageBookData[bookId].property.is_open);
  return opendBookId || itemBookIds[0];
}

export function* loadTotalItems(unitId, orderType, orderBy, page, setItems, setTotalCount) {
  yield call(loadUnitOrders, unitId, orderType, orderBy, page);
  // 시리즈 리스트 페이지별 도서 목록
  const unitOrders = yield select(getUnitOrders, unitId, orderType, orderBy, page);
  const bookIds = toFlatten(unitOrders.items, 'b_ids').reduce((prev, current) => prev.concat(current), []);
  yield call(loadBookData, bookIds);
  const pageBookData = yield select(getBooks, bookIds);

  let items = [];
  if (bookIds.length > 0) {
    // 내가 갖고있는 도서 목록
    const libraryItems = toDict((yield call(fetchItems, bookIds)).items.filter(x => !(x.hidden || x.is_deleted)), 'b_id');

    // unitOrders와 libraryItems을 병합해서 재구성한다.
    items = unitOrders.items.map(unitOrder => {
      const { b_ids: itemBookIds } = unitOrder;
      const libraryItem = getLibraryItem(itemBookIds, libraryItems);
      const bookId = libraryItem ? libraryItem.b_id : getOpendBookId(itemBookIds, pageBookData);

      return {
        b_id: bookId,
        expire_date: libraryItem ? libraryItem.expire_date : null,
        purchase_date: libraryItem ? libraryItem.purchase_date : null,
        service_type: libraryItem ? libraryItem.service_type : null,
        is_ridiselect: libraryItem && libraryItem.service_type === ServiceType.RIDISELECT,
        remain_time: libraryItem ? getRemainTime(libraryItem) : '',
        purchased: !!libraryItem,
      };
    });
  }

  yield all([put(setItems(items)), put(setTotalCount(unitOrders.total_count))]);
}

export function* isTotalSeriesView(unitId, order) {
  const unit = yield select(getUnit, unitId);
  return UnitType.isSeries(unit.type) && (order === OrderOptions.UNIT_ORDER_ASC.key || order === OrderOptions.UNIT_ORDER_DESC.key);
}
