import Router from 'next/router';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { UnitType } from '../../../constants/unitType';
import { URLMap } from '../../../constants/urls';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps } from '../../../utils/uri';
import { loadBookData, loadUnitData } from '../../book/sagas';
import { downloadBooks } from '../../bookDownload/sagas';
import { MakeBookIdsError } from '../../common/errors';
import { getRevision, requestCheckQueueStatus, requestHide } from '../../common/requests';
import { getBookIdsByItems } from '../../common/sagas';
import { showDialog } from '../../dialog/actions';
import { getQuery } from '../../router/selectors';
import { selectBooks } from '../../selection/actions';
import { getSelectedBooks } from '../../selection/selectors';
import { showToast } from '../../toast/actions';
import { setError, setFullScreenLoading } from '../../ui/actions';
import { loadRecentlyUpdatedData } from '../common/sagas/rootSagas';
import {
  CHANGE_SEARCH_KEYWORD,
  DOWNLOAD_SELECTED_SEARCH_BOOKS,
  HIDE_SELECTED_SEARCH_BOOKS,
  LOAD_SEARCH_ITEMS,
  SELECT_ALL_SEARCH_BOOKS,
  setItems,
  setPage,
  setSearchIsFetchingBooks,
  setSearchKeyword,
  setTotalCount,
} from './actions';
import { fetchSearchItems, fetchSearchItemsTotalCount } from './requests';
import { getItems, getItemsByPage, getOptions } from './selectors';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  const keyword = query.keyword || '';

  yield all([put(setPage(page)), put(setSearchKeyword(keyword))]);
}

function* moveToFirstPage() {
  const query = yield select(getQuery);

  const linkProps = makeLinkProps({ pathname: URLMap.search.href }, URLMap.search.as, {
    ...query,
    page: 1,
  });

  Router.replace(linkProps.href, linkProps.as);
}

function* loadPage() {
  yield put(setError(false));
  yield call(persistPageOptionsFromQueries);

  const { page, keyword } = yield select(getOptions);

  if (!keyword) {
    return;
  }

  try {
    yield put(setSearchIsFetchingBooks(true));

    const [itemResponse, countResponse] = yield all([call(fetchSearchItems, keyword, page), call(fetchSearchItemsTotalCount, keyword)]);

    // 전체 데이터가 있는데 데이터가 없는 페이지에 오면 1페이지로 이동한다.
    if (!itemResponse.items.length && countResponse.unit_total_count) {
      yield moveToFirstPage();
      return;
    }

    // Request BookData
    const bookIds = toFlatten(itemResponse.items, 'b_id');
    yield all([call(loadBookData, bookIds), call(loadUnitData, toFlatten(itemResponse.items, 'unit_id'))]);
    yield all([put(setItems(itemResponse.items)), put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count))]);

    yield fork(loadRecentlyUpdatedData, bookIds);
  } catch (err) {
    yield put(setError(true));
  } finally {
    yield put(setSearchIsFetchingBooks(false));
  }
}

function changeSearchKeyword(action) {
  const linkProps = makeLinkProps({ pathname: URLMap.search.href }, URLMap.search.as, {
    page: 1,
    keyword: action.payload.keyword,
  });
  Router.push(linkProps.href, linkProps.as);
}

function* hideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  let queueIds;
  try {
    const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks));
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
    yield call(loadPage);
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
  const selectedBooks = yield select(getSelectedBooks);

  try {
    const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks));
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
  const bookIds = toFlatten(items.filter(item => !UnitType.isShelf(item.unit_type)), 'b_id');
  yield put(selectBooks(bookIds));
}

export default function* purchasedSearchRootSaga() {
  yield all([
    takeEvery(LOAD_SEARCH_ITEMS, loadPage),
    takeEvery(CHANGE_SEARCH_KEYWORD, changeSearchKeyword),
    takeEvery(HIDE_SELECTED_SEARCH_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_SEARCH_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_SEARCH_BOOKS, selectAllBooks),
  ]);
}
