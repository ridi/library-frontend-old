import { Provider } from 'react-redux';
import App, { Container } from 'next/app';
import withReduxSaga from 'next-redux-saga';

import flow from '../utils/flow';
import injectStore from '../store';

import createConnectedRouterWrapper from '../services/router/routerWrapper';

class LibraryApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
    return { pageProps };
  }

  render() {
    const { Component, pageProps, store } = this.props;
    const ConnecterRouterWrapper = createConnectedRouterWrapper();
    return (
      <Container>
        <Provider store={store}>
          <ConnecterRouterWrapper>
            <Component {...pageProps} />
          </ConnecterRouterWrapper>
        </Provider>
      </Container>
    );
  }
}

export default flow(
  [withReduxSaga({ async: true }), injectStore],
  LibraryApp,
);
