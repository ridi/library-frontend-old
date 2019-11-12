import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as actions from './actions';
import * as requests from './requests';
import { ServiceType } from 'constants/serviceType';

export function* updateCategories() {
  const categories = yield call(requests.fetchPurchaseCategories);
  const allCategory = categories.shift();

  yield put(actions.setCategoryFilterOptions(allCategory, categories));
}

export function* updateServiceTypes() {
  const ServiceTypeFilterList = [
    {
      serviceType: ServiceType.NORMAL,
      title: '구매',
      count: 0,
    },
    {
      serviceType: ServiceType.RENT,
      title: '대여',
      count: 0,
    },
    {
      serviceType: ServiceType.SELECT,
      title: '리디셀렉트',
      count: 0,
    },
  ];
  const [...serviceTypesCounts] = yield all(
    ServiceTypeFilterList.map(filter => call(requests.fetchPurchaseServiceTypesCount, filter.serviceType)),
  );
  yield put(
    actions.setServiceTypeFilterOptions(
      ServiceTypeFilterList.map((serviceTypeFilter, index) => ({
        title: serviceTypeFilter.title,
        value: serviceTypeFilter.serviceType,
        count: serviceTypesCounts[index].item_total_count,
      })).filter(serviceTypeFilter => serviceTypeFilter.count > 0),
    ),
  );
}

export default function* filterRootSaga() {
  yield all([takeLatest(actions.UPDATE_CATEGORIES, updateCategories), takeLatest(actions.UPDATE_SERVICE_TYPES, updateServiceTypes)]);
}
