import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, matchPath, withRouter } from 'react-router-dom';
import NotFound from './pages/errors/notFound';
import PurchasedHidden from './pages/purchased/hidden';
import PurchasedMain from './pages/purchased/main';
import PurchasedSearch from './pages/purchased/search';
import SerialPreference from './pages/serialPreference';
import ShelvesList from './pages/shelves/list';
import ShelfDetail from './pages/shelves/detail';
import Unit from './pages/unit';

const routes = [
  {
    component: PurchasedMain,
    path: '/',
    exact: true,
  },
  {
    component: PurchasedMain,
    path: '/books',
    exact: true,
  },
  {
    component: PurchasedSearch,
    path: '/books/search',
    exact: true,
  },
  {
    component: PurchasedHidden,
    path: '/books/hidden',
    exact: true,
  },
  {
    component: SerialPreference,
    path: '/serial-preferences',
    exact: true,
  },
  {
    component: ShelvesList,
    path: '/shelves',
    exact: true,
  },
  {
    component: Unit,
    path: '/shelf/:uuid/:unitId',
  },
  {
    component: ShelfDetail,
    path: '/shelf/:uuid',
  },
  {
    component: Unit,
    path: '/books/search/:unitId',
  },
  {
    component: Unit,
    path: '/books/hidden/:unitId',
  },
  {
    component: Unit,
    path: '/books/:unitId',
  },
  {
    component: NotFound,
  },
];

function Routes({ dispatch, location }) {
  React.useEffect(
    () => {
      let component = null;
      let matchData = null;
      for (const route of routes) {
        ({ component } = route);
        matchData = matchPath(location.pathname, route);
        if (matchData != null) {
          break;
        }
      }
      if (matchData != null) {
        if (typeof component.prepare === 'function') {
          component.prepare({ ...matchData, dispatch, location });
        }
      }
    },
    [dispatch, location],
  );
  return (
    <Switch>
      {routes.map(props => (
        <Route key={JSON.stringify(props)} {...props} />
      ))}
    </Switch>
  );
}

export default withRouter(connect()(Routes));