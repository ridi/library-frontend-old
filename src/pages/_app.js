import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withReduxSaga from 'next-redux-saga';
import { hydrate, cache } from 'emotion';
import { CacheProvider } from '@emotion/core';

import { initializeApi } from '../api';
import injectStore from '../store';
import flow from '../utils/flow';
import { initializeSentry } from '../utils/sentry';
import { initializeTabKeyFocus, registerTabKeyUpEvent, registerMouseDownEvent } from '../utils/tabFocus';

import createConnectedRouterWrapper from '../services/router/routerWrapper';
import Layout from './base/Layout';
import Prefetch from '../components/Prefetch';

class LibraryApp extends App {
  static async getInitialProps({ Component, ctx }) {
    initializeApi(ctx.req);
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  constructor() {
    super();
    this.disposeBag = [];
  }

  componentWillMount() {
    // emotion을 통해 중복 CSS를 만들지 않기 위해서 hydrate 로직을 추가한다.
    if (typeof window !== 'undefined') {
      hydrate(window.__NEXT_DATA__.ids);
      initializeTabKeyFocus();
      initializeSentry();
    }
  }

  componentDidMount() {
    const body = document.querySelector('body');
    this.disposeBag.push(registerTabKeyUpEvent(body));
    this.disposeBag.push(registerMouseDownEvent(body));
  }

  componentWillUnmount() {
    this.disposeBag.forEach(callback => {
      callback();
    });
    this.disposeBag = [];
  }

  render() {
    const { Component, pageProps, store } = this.props;
    const ConnectedRouterWrapper = createConnectedRouterWrapper();
    return (
      <Container>
        <Provider store={store}>
          <CacheProvider value={cache}>
            <Layout>
              <ConnectedRouterWrapper />
              <Prefetch />
              <Component {...pageProps} />
            </Layout>
          </CacheProvider>
        </Provider>
      </Container>
    );
  }
}

export default flow(
  [withReduxSaga({ async: true }), injectStore],
  LibraryApp,
);
