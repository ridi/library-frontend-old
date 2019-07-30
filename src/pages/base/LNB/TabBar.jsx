/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { connect } from 'react-redux';
import { TabBar as LNBTabBar, TabLinkItem } from '../../../components/TabBar';
import * as featureIds from '../../../constants/featureIds';
import { URLMap } from '../../../constants/urls';
import * as featureSelectors from '../../../services/feature/selectors';
import BetaIcon from '../../../svgs/Beta.svg';
import Responsive from '../Responsive';

export const TabMenuTypes = {
  ALL_BOOKS: 'ALL BOOKS',
  SHELVES: 'SHELVES',
  SERIAL_PREFERENCE: 'SERIAL_PREFERENCE',
  SHELF_LIST: 'SHELF_LIST',
};

const styles = {
  LNBTabBarWrapper: {
    height: 40,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #d1d5d9',
  },
};

const betaIconStyle = isActive => css`
  position: absolute;
  right: -16px;
  top: -1px;
  width: 22px;
  height: 12px;
  fill: ${isActive ? '#40474d' : '#808991'};
`;

const TabMenus = [
  {
    type: TabMenuTypes.ALL_BOOKS,
    name: '모든 책',
    linkInfo: {
      href: URLMap.main.href,
      as: URLMap.main.as,
    },
  },
  {
    type: TabMenuTypes.SHELVES,
    name: '책장',
    linkInfo: {
      href: URLMap.shelves.href,
      as: URLMap.shelves.as,
    },
    icon: isActive => <BetaIcon css={betaIconStyle(isActive)} />,
  },
  {
    type: TabMenuTypes.SERIAL_PREFERENCE,
    name: '선호 작품',
    linkInfo: {
      href: URLMap.serialPreference.href,
      as: URLMap.serialPreference.as,
    },
  },
];

const mapStateToProps = state => ({
  isSyncShelfEnabled: featureSelectors.getIsFeatureEnabled(state, featureIds.SYNC_SHELF),
});

export const TabBar = connect(mapStateToProps)(({ activeMenu, isSyncShelfEnabled }) => {
  const menus = isSyncShelfEnabled ? TabMenus : TabMenus.filter(item => item.type !== TabMenuTypes.SHELVES);
  const menuNodes = menus.map(menu => (
    <TabLinkItem key={`${JSON.stringify(menu)}`} name={menu.name} isActive={activeMenu === menu.type} icon={menu.icon} {...menu.linkInfo} />
  ));
  return (
    <Responsive css={styles.LNBTabBarWrapper}>
      <LNBTabBar>{menuNodes}</LNBTabBar>
    </Responsive>
  );
});
