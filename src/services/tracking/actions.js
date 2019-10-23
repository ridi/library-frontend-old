export const INIT_TRACKER = 'INIT_TRACKER';
export const TRACK_PAGE = 'TRACK_PAGE';
export const TRACK_CLICK = 'TRACK_CLICK';

export const initTracker = () => ({
  type: 'INIT_TRACKER',
});

export const trackPage = pathName => ({
  type: 'TRACK_PAGE',
  payload: {
    pathName,
  },
});

export const trackClick = trackingParams => ({
  type: 'TRACK_CLICK',
  payload: {
    trackingParams,
  },
});
