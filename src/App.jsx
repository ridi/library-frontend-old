import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { initializeSentry } from './utils/sentry';
import { initializeTabKeyFocus, registerTabKeyUpEvent, registerMouseDownEvent } from './utils/tabFocus';
import Routes from './Routes';
import * as accountSelectors from './services/account/selectors';
import Favicon from './pages/base/Favicon';
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

  let routes;
  // 로그인 필요하면 로그인 화면만 띄움
  if (needLogin) {
    routes = <Route component={Login} />;
  } else {
    routes = <Route component={Routes} />;
  }

  return (
    <>
      <Favicon />
      <Layout>{routes}</Layout>
    </>
  );
}

function mapStateToProps(state) {
  return {
    needLogin: accountSelectors.getNeedLogin(state),
  };
}

export default connect(mapStateToProps)(App);
