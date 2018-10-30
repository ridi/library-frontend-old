import React from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import { setLocation } from './actions';
import { locationFromUrl } from './utils';

const createConnectedRouter = () => {
  class withRouter extends React.Component {
    static toRoute(path) {
      return path.replace(/\/$/, '') || '/';
    }

    constructor(props, context) {
      super(props);
      this.store = context.store;
      this.listenRouteChange = this.listenRouteChange.bind(this);
      this.listenStoreChange = this.listenStoreChange.bind(this);
    }

    componentDidMount() {
      Router.events.on('routeChangeStart', this.listenRouteChange);
      Router.events.on('routeChangeError', this.listenStoreChange);
      Router.events.on('routeChangeComplete', this.listenStoreChange);
    }

    componentWillUnmount() {
      Router.events.off('routeChangeStart', this.listenRouteChange);
      Router.events.off('routeChangeError', this.listenStoreChange);
      Router.events.off('routeChangeComplete', this.listenStoreChange);
    }

    listenRouteChange(as) {
      const { setLocation: dispatchSetLocation } = this.props;
      const location = locationFromUrl(as);
      dispatchSetLocation(location);
    }

    listenStoreChange() {
      const [isMismatch, url] = this.checkMismatch();
      if (isMismatch) {
        this.rollback(url);
      }
    }

    checkMismatch() {
      const state = this.store.getState();
      const {
        pathname: pathnameInStore,
        search: searchInStore,
        hash: hashInStore,
      } = state.router.location;

      const {
        pathname: pathnameInHistory,
        search: searchInHistory,
        hash: hashInHistory,
      } = locationFromUrl(Router.asPath);

      return [
        pathnameInStore !== pathnameInHistory ||
          searchInStore !== searchInHistory ||
          hashInStore !== hashInHistory,
        `${pathnameInStore}${searchInStore}${hashInStore}`,
      ];
    }

    rollback(url, as = url) {
      // Router의 Events를 보내지 않고 페이지 복구를 위해 Router코드를 직접 호출함
      // `change` 메소드의 간소화 버전, https://github.com/zeit/next.js/blob/canary/packages/next-server/lib/router/router.js
      if (Router.router.onlyAHashChange(url)) {
        Router.router.changeState('replaceState', url, as);
        Router.router.scrollToHash(url);
        return true;
      }

      const { pathname, query, hash } = locationFromUrl(url, true);
      const route = this.toRoute(pathname);
      const routeInfo = Router.router.components[route];
      Router.router.changeState('replaceState', url, as);
      Router.router.set(route, pathname, query, url, {
        ...routeInfo,
        hash,
      });
      return true;
    }

    render() {
      const { children } = this.props;
      return children;
    }
  }
  return connect(
    null,
    {
      setLocation,
    },
  )(withRouter);
};

export default createConnectedRouter;
