import { all, call, put, select } from 'redux-saga/effects';
import { OrderOptions } from '../../../../constants/orderOptions';
import { ServiceType } from '../../../../constants/serviceType';
import { UnitType } from '../../../../constants/unitType';
import { toDict, toFlatten } from '../../../../utils/array';
import { loadBookData, loadUnitOrders } from '../../../book/sagas';
import { getUnit, getUnitOrders, getBooks } from '../../../book/selectors';
import { fetchItems } from '../requests';

function getLibraryItem(itemBookIds, libraryItems) {
  const selectedLibraryItems = itemBookIds.map(bookId => libraryItems[bookId]).filter(item => !!item);
  // 우선순위:
  // 1. 대여 기한이 많이 남은 것 (만료 시각이 큰 것)
  //    - 만료 기한이 없는 도서는 만료 시각이 최댓값을 가짐
  // 2. 셀렉트 도서가 아닌 것
  // 3. 최근에 구매한 것 (구매 시각이 큰 것)
  let optimalValue = null;
  for (const item of selectedLibraryItems) {
    if (optimalValue == null) {
      optimalValue = item;
    } else if (optimalValue.expire_date !== item.expire_date) {
      if (new Date(optimalValue.expire_date) < new Date(item.expire_date)) {
        optimalValue = item;
      }
    } else if (optimalValue.is_ridiselect !== item.is_ridiselect) {
      if (!item.is_ridiselect) {
        optimalValue = item;
      }
    } else if (optimalValue.purchase_date !== item.purchase_date) {
      if (new Date(optimalValue.purchase_date) < new Date(item.purchase_date)) {
        optimalValue = item;
      }
    }
  }
  return optimalValue;
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
