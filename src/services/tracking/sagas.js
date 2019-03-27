import { DeviceType, Tracker } from '@ridi/event-tracker';
import { select, takeEvery } from 'redux-saga/effects';
import config from '../../config';
import { LOCATION_CHANGE } from './actions';

let tracker;
let previousUrl;

const initializeTracker = userId => {
  const deviceBP = 840;
  const deviceType = document.body.clientWidth < deviceBP ? DeviceType.Mobile : DeviceType.PC;

  tracker = new Tracker({
    debug: config.ENVIRONMENT !== 'production',
    deviceType,
    userId,
    tagManagerOptions: {
      trackingId: 'GTM-5XSZZGH',
    },
  });
  tracker.initialize();
};

export function* watchLocationChange(action) {
  const referrer = previousUrl || document.referrer;
  const state = yield select(s => s);
  const isLogin = state.account && state.account.userInfo && state.account.userInfo.id;
  const url = `${config.BASE_URL}${action.payload.url}`;

  if (isLogin) {
    const {
      account: {
        userInfo: { id: userId },
      },
    } = state;
    if (!tracker) initializeTracker(userId);

    if (referrer) {
      tracker.sendPageView(url, referrer);
    } else {
      tracker.sendPageView(url);
    }
    previousUrl = url;
  }
}

export default function* trackingRootSaga() {
  yield takeEvery(LOCATION_CHANGE, watchLocationChange);
}
