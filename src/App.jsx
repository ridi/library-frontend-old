import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import { PageType, URLMap } from './constants/urls';
import { initializeSentry } from './utils/sentry';
import { initializeTabKeyFocus, registerTabKeyUpEvent, registerMouseDownEvent } from './utils/tabFocus';
import Routes from './Routes';
import * as accountSelectors from './services/account/selectors';
import Favicon from './pages/base/Favicon';
import Layout from './pages/base/Layout';
import Login from './pages/login';

function App(props) {
  const { needLogin, userInfo } = props;

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

  const routes = [];
  if (userInfo == null || needLogin) {
    // 로그인이 필요할지도 모르는 경우
    routes.push(<Route exact path={URLMap[PageType.LOGIN].path} component={Login} />);
    if (needLogin) {
      // 로그인이 필요한 경우. 다른 경로로 접근하면 리디렉션하도록 함
      routes.push(
        <Route
          render={({ location }) => {
            const searchParams = new URLSearchParams();
            searchParams.set('next', `${location.pathname}${location.search}${location.hash}`);
            const to = {
              pathname: URLMap[PageType.LOGIN].as,
              search: `?${searchParams.toString()}`,
            };
            return <Redirect to={to} />;
          }}
        />,
      );
    }
  } else {
    // 로그인된 경우. 로그인 경로로 접근하면 next로 보냄
    routes.push(
      <Route
        exact
        path={URLMap[PageType.LOGIN].path}
        render={({ location }) => {
          const searchParams = new URLSearchParams(location.search);
          const next = searchParams.get('next') || URLMap[PageType.INDEX].as;
          return <Redirect to={next} />;
        }}
      />,
      <Route component={Routes} />,
    );
  }

  return (
    <>
      <Favicon />
      <Layout>
        <Switch>{routes}</Switch>
      </Layout>
    </>
  );
}

function mapStateToProps(state) {
  return {
    needLogin: accountSelectors.getNeedLogin(state),
    userInfo: accountSelectors.getUserInfo(state),
  };
}

export default connect(mapStateToProps)(App);
