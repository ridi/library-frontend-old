import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';

import { initializeSentry } from './utils/sentry';
import { initializeTabKeyFocus, registerTabKeyUpEvent, registerMouseDownEvent } from './utils/tabFocus';
import Routes from './Routes';
import ErrorBoundary from './components/ErrorBoundary';
import * as accountSelectors from './services/account/selectors';
import Layout from './pages/base/Layout';
import { Loading } from './pages/base/Loading';

const Login = React.lazy(() => import('./pages/login'));

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

  return (
    <ErrorBoundary>
      <Layout>
        <React.Suspense fallback={<Loading />}>{routes}</React.Suspense>
      </Layout>
    </ErrorBoundary>
  );
}

function mapStateToProps(state) {
  return {
    needLogin: accountSelectors.getNeedLogin(state),
  };
}

export default connect(mapStateToProps)(App);
