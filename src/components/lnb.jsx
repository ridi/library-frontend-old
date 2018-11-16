import React from 'react';
import Router from 'next/router';

import { connect } from 'react-redux';

import { TabBar, TabItem } from './Tabbar';

import { getLocation } from '../services/router/selectors';

const TabBarRoutes = ['/purchased', '/purchased/search'];
const TitleBarRoutes = [];

const TabMenus = [
  {
    name: '모든 책',
    pathname: '/purchased',
    pathRegExp: /\/purchased(\/search)?$/,
  },
];

class LNB extends React.Component {
  renderTabBar() {
    const {
      location: { pathname: currentPathname },
    } = this.props;

    return (
      <TabBar>
        {TabMenus.map(menu => (
          <TabItem name={menu.name} isActive={!!currentPathname.match(menu.pathRegExp)} onClick={() => Router.push(menu.pathname)} />
        ))}
      </TabBar>
    );
  }

  renderTitleBar() {
    return <>타이틀</>;
  }

  render() {
    const {
      location: { pathname: currentPathname },
    } = this.props;

    let lnb = null;
    if (TabBarRoutes.includes(currentPathname)) {
      lnb = this.renderTabBar();
    } else if (TitleBarRoutes.includes(currentPathname)) {
      lnb = this.renderTitleBar();
    }

    if (lnb === null) {
      return null;
    }

    return <nav>{lnb}</nav>;
  }
}

const mapStateToProps = state => {
  const location = getLocation(state);

  return {
    location,
  };
};
const mapDisaptchToProps = {};

export default connect(
  mapStateToProps,
  mapDisaptchToProps,
)(LNB);
