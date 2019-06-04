import Router from 'next/router';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { OrderOptions } from '../../../constants/orderOptions';
import { UnitType } from '../../../constants/unitType';
import { PageType, URLMap } from '../../../constants/urls';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps } from '../../../utils/uri';
import { loadBookData, loadUnitData } from '../../book/sagas';
import { downloadBooks } from '../../bookDownload/sagas';
import { MakeBookIdsError } from '../../common/errors';
import { getRevision, requestCheckQueueStatus, requestHide } from '../../common/requests';
import { getBookIdsByItems } from '../../common/sagas';
import { showDialog } from '../../dialog/actions';
import { selectItems } from '../../selection/actions';
import { getSelectedItems } from '../../selection/selectors';
import * as shelfSagas from '../../shelf/sagas';
import * as shelfSelectors from '../../shelf/selectors';
import { showToast } from '../../toast/actions';
import { setError, setFullScreenLoading } from '../../ui/actions';
import { loadRecentlyUpdatedData } from '../common/sagas/rootSagas';
import * as actions from './actions';
import { fetchMainItems, fetchMainItemsTotalCount, fetchPurchaseCategories } from './requests';
import { getFilter, getItems, getItemsByPage, getOptions, getPage } from './selectors';

function moveToFirstPage(payload) {
  const linkProps = makeLinkProps({ pathname: URLMap.main.href }, URLMap.main.as, {
    page: 1,
    order_type: payload.orderType,
    order_by: payload.orderBy,
    filter: payload.categoryFilter,
  });

  Router.replace(linkProps.href, linkProps.as);
}

function* loadMainItemsWithPayload(payload) {
  // Clear Error
  yield put(setError(false));

  const { currentPage, orderType, orderBy, categoryFilter, isServer } = payload;
  try {
    const [itemResponse, countResponse, categories] = yield all([
      call(fetchMainItems, orderType, orderBy, categoryFilter, currentPage),
      call(fetchMainItemsTotalCount, orderType, orderBy, categoryFilter),
      call(fetchPurchaseCategories),
    ]);

    // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
    if (!itemResponse.items.length && countResponse.unit_total_count) {
      // 서버 렌더링에서는 바로 리디렉트하기 까다로우므로 로딩 표시를 띄워놓는
      // 것으로 대체
      if (!isServer) {
        moveToFirstPage(payload);
      }
      // 이대로 리턴하면 로딩 표시가 남는다
      return;
    }

    // Request BookData
    const bookIds = toFlatten(itemResponse.items, 'b_id');
    yield all([call(loadBookData, bookIds), call(loadUnitData, toFlatten(itemResponse.items, 'unit_id'))]);
    yield put(
      actions.updateItems({
        items: itemResponse.items,
        unitTotalCount: countResponse.unit_total_count,
        itemTotalCount: countResponse.item_total_count,
        filterOptions: categories,
      }),
    );
    yield fork(loadRecentlyUpdatedData, bookIds);
  } catch (err) {
    yield put(setError(true));
  }
  yield put(actions.setIsFetchingBooks(false));
}

function* loadMainItems(action) {
  yield call(loadMainItemsWithPayload, action.payload);
}

function* hideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedItems);

  const { order } = yield select(getOptions);
  const { orderType, orderBy } = OrderOptions.parse(order);

  let queueIds;
  try {
    const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks), orderType, orderBy);
    const revision = yield call(getRevision);
    queueIds = yield call(requestHide, bookIds, revision);
  } catch (err) {
    let message = '숨기기 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    if (err instanceof MakeBookIdsError) {
      message = '도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    yield all([put(showDialog('도서 숨기기 오류', message)), put(setFullScreenLoading(false))]);
    return;
  }

  let isFinish = false;
  try {
    isFinish = yield call(requestCheckQueueStatus, queueIds);
  } catch (err) {
    isFinish = false;
  }

  if (isFinish) {
    const currentPage = yield select(getPage);
    const categoryFilter = yield select(getFilter);
    yield call(loadMainItemsWithPayload, { currentPage, orderType, orderBy, categoryFilter, isServer: false });
  }

  yield all([
    put(
      showToast({
        message: isFinish ? '내 서재에서 숨겼습니다.' : '내 서재에서 숨겼습니다. 잠시후 반영 됩니다.',
        linkName: '숨긴 도서 목록 보기',
        linkProps: makeLinkProps(URLMap.hidden.href, URLMap.hidden.as),
      }),
    ),
    put(setFullScreenLoading(false)),
  ]);
}

function* downloadSelectedBooks() {
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedItems);

  const { order } = yield select(getOptions);
  const { orderType, orderBy } = OrderOptions.parse(order);

  try {
    const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks), orderType, orderBy);
    yield call(downloadBooks, bookIds);
  } catch (err) {
    let message = '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    if (err instanceof MakeBookIdsError) {
      message = '다운로드 대상 도서의 정보 구성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    }
    yield put(showDialog('다운로드 오류', message));
  }
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items.filter(item => !UnitType.isCollection(item.unit_type)), 'b_id');
  yield put(selectItems(bookIds));
}

function* addSelectedToShelf({ payload }) {
  const { uuid } = payload;
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedItems);
  const units = Object.entries(selectedBooks)
    .filter(([, selected]) => selected)
    .map(([key]) => ({
      unitId: Number(items[key].unit_id),
      bookIds: [key],
    }));
  const shelfName = yield select(shelfSelectors.getShelfName, uuid);
  yield call(shelfSagas.addShelfItem, { payload: { uuid, units } });
  yield put(
    showToast({
      message: `${units.length}권을 "${shelfName}" 책장에 추가했습니다.`,
      linkName: '책장 바로 보기',
      linkProps: makeLinkProps(
        {
          pathname: URLMap[PageType.SHELF_DETAIL].href,
          query: { uuid },
        },
        URLMap[PageType.SHELF_DETAIL].as({ uuid }),
      ),
    }),
  );
}

export default function* purchaseMainRootSaga() {
  yield all([
    takeEvery(actions.LOAD_MAIN_ITEMS, loadMainItems),
    takeEvery(actions.HIDE_SELECTED_MAIN_BOOKS, hideSelectedBooks),
    takeEvery(actions.DOWNLOAD_SELECTED_MAIN_BOOKS, downloadSelectedBooks),
    takeEvery(actions.SELECT_ALL_MAIN_BOOKS, selectAllBooks),
    takeEvery(actions.ADD_MAIN_SELECTED_TO_SHELF, addSelectedToShelf),
  ]);
}
