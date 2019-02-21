import { createSelector } from 'reselect';
import { parse } from 'qs';
import config from '../../config';

const getRouterState = state => state.router;

export const getLocation = createSelector(
  getRouterState,
  routerState => routerState.location,
);

export const getLocationHref = createSelector(
  getLocation,
  location => `${config.BASE_URL}${location.pathname}${location.search}`,
);

export const getQuery = createSelector(
  getLocation,
  location => parse(location.search, { charset: 'utf-8', ignoreQueryPrefix: true }),
);
