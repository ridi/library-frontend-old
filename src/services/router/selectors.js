import { createSelector } from 'reselect';
import { parse } from 'qs';

const getRouterState = state => state.router;

export const getLocation = createSelector(
  getRouterState,
  routerState => routerState.location,
);
export const getQuery = createSelector(
  getLocation,
  location => parse(location.search, { charset: 'utf-8', ignoreQueryPrefix: true }),
);
