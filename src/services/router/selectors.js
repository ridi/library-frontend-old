import { createSelector } from 'reselect';
import { parse } from 'qs';

const getRouterState = state => state.router;

export const getQuery = createSelector(getRouterState, routerState => {
  const { search } = routerState.location;
  return parse(search, { charset: 'utf-8', ignoreQueryPrefix: true });
});
