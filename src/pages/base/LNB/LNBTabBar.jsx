/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { jsx, css } from '@emotion/core';

import { TabBar, TabLinkItem } from '../../../components/TabBar';
import Responsive from '../Responsive';

import { URLMap } from '../../../constants/urls';
import { getPageInfo as getMainPageInfo } from '../../../services/purchased/main/selectors';

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

class LNBTabBar extends React.Component {
  get tabMenus() {
    const { mainPageInfo } = this.props;
    return [
      {
        type: TabMenuTypes.ALL_BOOKS,
        name: '모든 책',
        linkInfo: {
          href: URLMap.main.href,
          as: URLMap.main.as,
          query: {
            page: mainPageInfo.currentPage,
            orderType: mainPageInfo.orderType,
            orderBy: mainPageInfo.orderBy,
            filter: mainPageInfo.filter,
          },
        },
      },
    ];
  }

  render() {
    const { activeMenu } = this.props;
    return (
      <nav css={styles.LNBTabBarWrapper}>
        <Responsive>
          <TabBar>
            {this.tabMenus.map(menu => (
              <TabLinkItem name={menu.name} isActive={activeMenu === menu.type} {...menu.linkInfo} />
            ))}
          </TabBar>
        </Responsive>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  const mainPageInfo = getMainPageInfo(state);
  return { mainPageInfo };
};

export default connect(mapStateToProps)(LNBTabBar);
