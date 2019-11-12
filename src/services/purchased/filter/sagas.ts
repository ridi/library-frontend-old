import { ServiceType } from 'constants/serviceType';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as requests from './requests';

export function* updateCategories() {
  const { allCategoryCount, categories } = yield call(requests.fetchPurchaseCategories);
  yield all([put(actions.setCategoryFilterOptions(categories)), put(actions.setAllCategoryCount(allCategoryCount))]);
}

const ServiceTypeFilter = [
  {
    title: '구매',
    value: ServiceType.NORMAL,
    count: 0,
  },
  {
    title: '대여',
    value: ServiceType.RENT,
    count: 0,
  },
  {
    title: '리디셀렉트',
    value: ServiceType.SELECT,
    count: 0,
  },
];

export function* updateServiceTypes() {
  const serviceTypeCounts = yield all(ServiceTypeFilter.map(filter => call(requests.fetchPurchaseServiceTypesCount, filter.value)));

  // 서비스 타입에 해당하는 도서가 1권 이상일 때에만 노출
  yield put(
    actions.setServiceTypeFilterOptions(
      ServiceTypeFilter.map((filter, index) => {
        filter.count = serviceTypeCounts[index] ? serviceTypeCounts[index].item_total_count : 0;
        return filter;
      }).filter(filter => filter.count > 0),
    ),
  );
}

export default function* filterRootSaga() {
  yield all([takeLatest(actions.UPDATE_CATEGORIES, updateCategories), takeLatest(actions.UPDATE_SERVICE_TYPES, updateServiceTypes)]);
}
