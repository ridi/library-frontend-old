/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { jsx, css } from '@emotion/core';

import { TabBar, TabLinkItem } from '../../../components/TabBar';
import Responsive from '../Responsive';

import { URLMap } from '../../../constants/urls';

export const TabMenuTypes = {
  ALL_BOOKS: 'ALL BOOKS',
};

const styles = {
  LNBTabBarWrapper: css({
    height: 40,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #d1d5d9',
  }),
};

const TabMenus = [
  {
    type: TabMenuTypes.ALL_BOOKS,
    name: '모든 책',
    linkInfo: {
      href: URLMap.main.href,
      as: URLMap.main.as,
    },
  },
];

const LNBTabBar = ({ activeMenu }) => (
  <nav css={styles.LNBTabBarWrapper}>
    <Responsive>
      <TabBar>
        {TabMenus.map(menu => (
          <TabLinkItem name={menu.name} isActive={activeMenu === menu.type} {...menu.linkInfo} />
        ))}
      </TabBar>
    </Responsive>
  </nav>
);

export default LNBTabBar;
