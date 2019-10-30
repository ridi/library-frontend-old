export const INIT_TRACKER = 'INIT_TRACKER';
export const TRACK_PAGE = 'TRACK_PAGE';
export const TRACK_EVENT = 'TRACK_EVENT';

export const initTracker = () => ({
  type: 'INIT_TRACKER',
});

export const trackPage = pathName => ({
  type: 'TRACK_PAGE',
  payload: {
    pathName,
  },
});

export const trackEvent = ({ eventName, trackingParams }) => ({
  type: 'TRACK_EVENT',
  payload: {
    eventName,
    trackingParams,
  },
});
