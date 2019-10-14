import React from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './pages/base/Layout';
import PageLoadingSpinner from './pages/base/PageLoadingSpinner';
import Routes from './Routes';
import * as accountSelectors from './services/account/selectors';
import { initializeSentry } from './utils/sentry';
import { initializeTabKeyFocus, registerMouseDownEvent, registerTabKeyUpEvent } from './utils/tabFocus';

const Login = React.lazy(() => import('./pages/login'));

interface StateProps {
  needLogin: boolean;
}

type Props = StateProps;

function App(props: Props) {
  const { needLogin } = props;

  React.useEffect(() => {
    initializeTabKeyFocus();
    initializeSentry();
    const body = document.querySelector('body');
    const disposeBag = [];
    disposeBag.push(registerTabKeyUpEvent(body));
    disposeBag.push(registerMouseDownEvent(body));
    return () => {
      disposeBag.forEach(callback => {
        callback();
      });
    };
  }, []);

  const routes = needLogin ? <Route component={Login} /> : <Route component={Routes} />;

  return (
    <Layout>
      <ErrorBoundary>
        <React.Suspense fallback={<PageLoadingSpinner />}>{routes}</React.Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function mapStateToProps(state): StateProps {
  return {
    needLogin: accountSelectors.getNeedLogin(state),
  };
}

export default connect(mapStateToProps)(App);
