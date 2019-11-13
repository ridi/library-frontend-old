import { DeviceType, Tracker } from '@ridi/event-tracker';
import { ENV } from 'constants/environment';
import { all, call, select, takeEvery } from 'redux-saga/effects';
import config from '../../config';
import * as actions from './actions';

let tracker;
let previousUrl;

function* initializeTracker() {
  const account = yield select(state => state.account);
  const userId = account?.userInfo?.id;
  const deviceBP = 840;
  const deviceType = document.body.clientWidth < deviceBP ? DeviceType.Mobile : DeviceType.PC;

  tracker = new Tracker({
    debug: config.ENVIRONMENT !== ENV.PRODUCTION,
    deviceType,
    userId,
    tagManagerOptions: {
      trackingId: 'GTM-5XSZZGH',
    },
  });
  tracker.initialize();
}

function* watchTrackPage({ payload }) {
  const { pathName } = payload;
  const referrer = previousUrl || document.referrer;
  previousUrl = pathName;

  if (!tracker) yield call(initializeTracker);
  if (referrer) {
    tracker.sendPageView(pathName, referrer);
  } else {
    tracker.sendPageView(pathName);
  }
}

function* watchTrackEvent({ payload }) {
  const { eventName, trackingParams } = payload;
  if (!tracker) yield call(initializeTracker);
  tracker.sendEvent(eventName, trackingParams);
}

export default function* trackingRootSaga() {
  yield all([
    takeEvery(actions.INIT_TRACKER, initializeTracker),
    takeEvery(actions.TRACK_PAGE, watchTrackPage),
    takeEvery(actions.TRACK_EVENT, watchTrackEvent),
  ]);
}
