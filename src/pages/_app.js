import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withReduxSaga from 'next-redux-saga';
import { hydrate, injectGlobal } from 'emotion';

import { reset } from '../styles/reset';
import flow from '../utils/flow';
import injectStore from '../store';

import createConnectedRouterWrapper from '../services/router/routerWrapper';

import Layout from './base/Layout';

class LibraryApp extends App {
  constructor() {
    super();
    if (typeof window !== 'undefined') {
      hydrate(window.__NEXT_DATA__.ids);
    }
    injectGlobal(reset);
  }

  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    const ConnectedRouterWrapper = createConnectedRouterWrapper();
    return (
      <Container>
        <Provider store={store}>
          <ConnectedRouterWrapper>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ConnectedRouterWrapper>
        </Provider>
      </Container>
    );
  }
}

export default flow(
  [withReduxSaga({ async: true }), injectStore],
  LibraryApp,
);
