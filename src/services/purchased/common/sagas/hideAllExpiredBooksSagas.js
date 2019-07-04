import { channel, delay } from 'redux-saga';
import { all, call, put, take } from 'redux-saga/effects';
import { OrderOptions } from '../../../../constants/orderOptions';
import { URLMap } from '../../../../constants/urls';
import { makeLinkProps } from '../../../../utils/uri';
import { getRevision, requestCheckQueueStatus, requestHide } from '../../../common/requests';
import { getBookIdsByUnitIds } from '../../../common/sagas';
import { showConfirm } from '../../../confirm/actions';
import { showDialog } from '../../../dialog/actions';
import { showToast } from '../../../toast/actions';
import { setFullScreenLoading } from '../../../ui/actions';
import { fetchMainItems, fetchMainItemsTotalCount } from '../../main/requests';
import { HIDE_ALL_EXPIRED_BOOKS } from '../actions';
import { HIDE_ALL_EXPIRED_DONE_CHECK_MAX_RETRY_COUNT, HIDE_ALL_EXPIRED_MAX_COUNT_PER_ITER } from '../constants';
import { NotFoundExpiredBooksError } from '../errors';

const confirmChannel = channel();

function* getExpiredBookIds() {
  const { orderType, orderBy } = OrderOptions.EXPIRED_BOOKS_ONLY;
  let bookIds = [];

  let index = 1;
  while (true) {
    const itemResponse = yield call(fetchMainItems, orderType, orderBy, null, index);
    if (itemResponse.items.length === 0) {
      break;
    }

    const unitIds = itemResponse.items.map(item => item.unit_id);
    const bookIdsInUnit = yield call(getBookIdsByUnitIds, unitIds, orderType, orderBy);

    bookIds = bookIds.concat(bookIdsInUnit);

    // 최대치를 넘으면 그만 한다.
    if (bookIds.length >= HIDE_ALL_EXPIRED_MAX_COUNT_PER_ITER) {
      break;
    }
    index += 1;
  }

  return bookIds;
}

function* checkQueueIsDone(queueIds) {
  const { orderType, orderBy } = OrderOptions.EXPIRED_BOOKS_ONLY;
  const countResponse = yield call(fetchMainItemsTotalCount, orderType, orderBy, null);

  // 이 후에 또 할게 있으면 반영 완료되어야 한다.
  const shouldComplete = countResponse.itemTotalCount > queueIds.length;

  let isFinish = false;
  let index = 0;
  while (index < HIDE_ALL_EXPIRED_DONE_CHECK_MAX_RETRY_COUNT) {
    try {
      isFinish = yield call(requestCheckQueueStatus, queueIds);
    } catch (err) {
      isFinish = false;
    }

    // 완료 되었거나 완료 필수가 아닌 경우만 종료
    if (isFinish || !shouldComplete) {
      return isFinish;
    }

    // 바로 요청해 봐야 안될 확률이 높기 때문에 쉬고다시 요청한다.
    // 다시 요청 할 때마다 딜레이 시간을 늘린다.
    // 최대 10 초로 한다.
    yield delay(Math.min(500 * index, 500 * 20));
    index += 1;
  }

  // 반영이 완료 안되었으면 전체 숨기기를 더이상 진행하지 않는다.
  throw new Error();
}

function* internalHideAllExpiredBooks() {
  let isFinish = true;
  let isRequested = false;
  while (true) {
    // Step 1. 만료책 리스트를 가져온다.
    const bookIds = yield call(getExpiredBookIds);

    // Step 2. 만료된 책이 없으면 종료한다.
    if (!bookIds.length) {
      // Step 2-1. 만료된 책이 없는데 이전에 숨김 요청한 적이 없으면 에러처리
      if (!isRequested) {
        throw new NotFoundExpiredBooksError();
      }
      break;
    }

    // Step 3. 숨긴다.
    const revision = yield call(getRevision);
    const queueIds = yield call(requestHide, bookIds, revision);

    // Step 4. 숨긴 도서를 확인한다.
    isFinish = isFinish && (yield checkQueueIsDone(queueIds));
    isRequested = true;
  }

  return isFinish;
}

export function* hideAllExpiredBooks() {
  yield put(setFullScreenLoading(true));

  try {
    const isFinish = yield internalHideAllExpiredBooks();

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
  } catch (e) {
    if (e instanceof NotFoundExpiredBooksError) {
      yield all([put(showToast({ message: '만료된 도서가 없습니다.' })), put(setFullScreenLoading(false))]);
      return;
    }

    yield all([
      put(showDialog('도서 숨기기 오류', '숨기기 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')),
      put(setFullScreenLoading(false)),
    ]);
  } finally {
    // Router.replace(URLMap.main.href, URLMap.main.as);
  }
}

export function* confirmHideAllExpiredBooks() {
  yield put(setFullScreenLoading(true));
  const bookIds = yield call(getExpiredBookIds);
  yield put(setFullScreenLoading(false));

  if (bookIds.length) {
    yield put(
      showConfirm({
        title: '만료 도서 모두 숨기기',
        message: '만료된 도서를 모두 숨기시겠습니까?',
        confirmLabel: '숨기기',
        onClickConfirmButton: () => {
          confirmChannel.put({
            type: HIDE_ALL_EXPIRED_BOOKS,
          });
        },
      }),
    );
    const action = yield take(confirmChannel);
    if (action.type === HIDE_ALL_EXPIRED_BOOKS) yield call(hideAllExpiredBooks);
  } else {
    yield put(showToast({ message: '만료된 도서가 없습니다.' }));
  }
}
