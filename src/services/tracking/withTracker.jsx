import { DeviceType, Tracker } from '@ridi/event-tracker';
import React from 'react';
import { useSelector } from 'react-redux';
import config from '../../config';

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

const trackPage = (page, account) => {
  const referrer = previousUrl || document.referrer;
  const isLogin = account && account.userInfo && account.userInfo.id;
  if (isLogin) {
    const {
      userInfo: { id: userId },
    } = account;
    if (!tracker) initializeTracker(userId);
    if (referrer) {
      tracker.sendPageView(page, referrer);
    } else {
      tracker.sendPageView(page);
    }
    previousUrl = page;
  }
};

export default function withTracker(WrappedComponent) {
  const account = useSelector(state => state.account);
  const HOC = props => {
    const { location } = props;

    React.useEffect(() => {
      trackPage(location.pathname, account);
    }, [location.pathname]);

    return <WrappedComponent {...props} />;
  };

  return HOC;
}
