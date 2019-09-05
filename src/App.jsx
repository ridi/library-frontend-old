import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { initializeSentry } from './utils/sentry';
import { initializeTabKeyFocus, registerTabKeyUpEvent, registerMouseDownEvent } from './utils/tabFocus';
import Routes from './Routes';
import * as accountSelectors from './services/account/selectors';
import Layout from './pages/base/Layout';
import Login from './pages/login';

function App(props) {
  const { needLogin } = props;

  React.useEffect(() => {
    initializeTabKeyFocus();
    initializeSentry();
    const body = document.querySelector('body');
    const disposeBag = [];
    disposeBag.push(registerTabKeyUpEvent(body));
    disposeBag.push(registerMouseDownEvent(body));
    return () => {
      for (const callback of disposeBag) {
        callback();
      }
    };
  }, []);

  const routes = needLogin ? <Route component={Login} /> : <Route component={Routes} />;

  return <Layout>{routes}</Layout>;
}

function mapStateToProps(state) {
  return {
    needLogin: accountSelectors.getNeedLogin(state),
  };
}

export default connect(mapStateToProps)(App);
