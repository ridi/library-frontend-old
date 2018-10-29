import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withReduxSaga from 'next-redux-saga';

import flow from '../utils/flow';
import injectStore from '../store';

class LibraryApp extends App {
  static async getInitialProps({ Component, ctx, router }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    if (router.query) {
      await this.parseQueryString(this.store, router.pathname, router.query);
    }

    return { pageProps };
  }

  static async parseQueryString(store, pathname, query) {
    // TODO: Query String Parse 로직 추가하기
    // 현재 예상 사용처, 검색페이지, 검색유닛페이지 접근시 keyword파싱해서 검색/검색유닛 페이지에 set
    if (pathname === '/about') {
      console.log(query);
    }
  }

  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default flow(
  [withReduxSaga({ async: true }), injectStore],
  LibraryApp,
);
