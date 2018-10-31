import React from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import { setLocation, commitLocation, rollbackLocation } from './actions';
import { locationFromUrl } from './utils';

const createConnectedRouter = () => {
  class withRouter extends React.Component {
    static toRoute(path) {
      return path.replace(/\/$/, '') || '/';
    }

    constructor(props, context) {
      super(props, context);
      this.listenRouteChange = this.listenRouteChange.bind(this);
      this.finishRouteChange = this.finishRouteChange.bind(this);
    }

    componentDidMount() {
      Router.events.on('routeChangeStart', this.listenRouteChange);
      Router.events.on('routeChangeError', this.finishRouteChange);
      Router.events.on('routeChangeComplete', this.finishRouteChange);
    }

    componentWillUnmount() {
      Router.events.off('routeChangeStart', this.listenRouteChange);
      Router.events.off('routeChangeError', this.finishRouteChange);
      Router.events.off('routeChangeComplete', this.finishRouteChange);
    }

    listenRouteChange(as) {
      const location = locationFromUrl(as);
      const { store } = this.props;
      store.dispatch(setLocation(location));
    }

    finishRouteChange() {
      const [isMismatch, url] = this.checkMismatch();
      if (isMismatch) {
        this.rollback(url);
      } else {
        this.commit();
      }
    }

    checkMismatch() {
      const { store } = this.props;
      const state = store.getState();
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

    commit() {
      const { store } = this.props;
      store.dispatch(commitLocation());
    }

    rollback(url, as = url) {
      // Router의 Events를 보내지 않고 페이지 복구를 위해 Router코드를 직접 호출함
      // `change` 메소드의 간소화 버전, https://github.com/zeit/next.js/blob/canary/packages/next-server/lib/router/router.js
      const { store } = this.props;
      store.dispatch(rollbackLocation());

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
  return withRouter;
};

export default createConnectedRouter;
