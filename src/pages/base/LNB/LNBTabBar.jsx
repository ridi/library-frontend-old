import React from 'react';
import Router from 'next/router';
import shortid from 'shortid';

import { connect } from 'react-redux';

import { TabBar, TabItem } from '../../../components/TabBar';

import { getLocation } from '../../../services/router/selectors';
import Responsive from '../Responsive';

import * as styles from './styles';

const TabMenus = [
  {
    name: '모든 책',
    pathname: '/purchased',
    pathRegExp: /\/purchased(\/search)?$/,
  },
];

const LNBTabBar = ({ location: { pathname: currentPathname } }) => (
  <nav className={styles.LNBTabBarWrapper}>
    <Responsive>
      <TabBar>
        {TabMenus.map(menu => (
          <TabItem
            key={shortid.generate()}
            name={menu.name}
            isActive={!!currentPathname.match(menu.pathRegExp)}
            onClick={() => Router.push(menu.pathname)}
          />
        ))}
      </TabBar>
    </Responsive>
  </nav>
);

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
)(LNBTabBar);
