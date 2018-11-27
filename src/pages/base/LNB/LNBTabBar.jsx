import React from 'react';
import Router from 'next/router';
import shortid from 'shortid';

import { TabBar, TabItem } from '../../../components/TabBar';
import Responsive from '../Responsive';
import * as styles from './styles';

import { URLMap } from '../../../constants/urls';

export const TabMenuTypes = {
  ALL_BOOKS: 'ALL BOOKS',
};

const TabMenus = [
  {
    type: TabMenuTypes.ALL_BOOKS,
    name: '모든 책',
    pathname: URLMap.main.as,
  },
];

const LNBTabBar = ({ activeMenu }) => (
  <nav className={styles.LNBTabBarWrapper}>
    <Responsive>
      <TabBar>
        {TabMenus.map(menu => (
          <TabItem
            key={shortid.generate()}
            name={menu.name}
            isActive={activeMenu === TabMenuTypes.ALL_BOOKS}
            onClick={() => Router.push(menu.pathname)}
          />
        ))}
      </TabBar>
    </Responsive>
  </nav>
);

export default LNBTabBar;
