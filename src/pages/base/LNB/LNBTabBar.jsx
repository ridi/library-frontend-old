/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Router from 'next/router';
import shortid from 'shortid';

import TabBar from '../../../components/TabBar';
import TabItem from '../../../components/TabItem';
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
    pathname: URLMap.main.as,
  },
];

const LNBTabBar = ({ activeMenu }) => (
  <nav css={styles.LNBTabBarWrapper}>
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
