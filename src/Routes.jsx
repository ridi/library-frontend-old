import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, matchPath, withRouter } from 'react-router-dom';
import PurchasedMain from './Test';

const routes = [
  {
    component: PurchasedMain,
    path: '/',
    exact: true,
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
