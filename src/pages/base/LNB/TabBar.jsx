import { TabBar as LNBTabBar, TabLinkItem } from '../../../components/TabBar';
import { URLMap } from '../../../constants/urls';
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

export const TabBar = ({ activeMenu }) => {
  const menus = TabMenus;
  const menuNodes = menus.map(menu => (
    <TabLinkItem key={`${JSON.stringify(menu)}`} name={menu.name} isActive={activeMenu === menu.type} icon={menu.icon} {...menu.linkInfo} />
  ));
  return (
    <Responsive css={styles.LNBTabBarWrapper}>
      <LNBTabBar>{menuNodes}</LNBTabBar>
    </Responsive>
  );
};
