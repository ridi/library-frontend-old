/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { jsx } from '@emotion/core';
import LogoRidibooks from '../../../svgs/LogoRidibooks.svg';
import LogoRidiselect from '../../../svgs/LogoRidiselect.svg';
import { startExcelDownload } from '../../../services/excelDownload/actions';
import { getIsExcelDownloading } from '../../../services/excelDownload/selectors';
import MyMenuModal from '../../../components/Modal/MyMenuModal';
import * as styles from './styles';
import { Hidden } from '../../../styles';
import BetaBadge from '../../../svgs/Beta.svg';
import MyMenuIcon from '../../../svgs/MyMenu.svg';
import MyMenuActiveIcon from '../../../svgs/MyMenu-active.svg';
import Responsive from '../Responsive';

const RIDIBOOKS_URL = 'https://ridibooks.com';
const RIDISELECT_URL = 'https://select.ridibooks.com';

class GNB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalActive: false,
    };
  }

  onModalBackgroundClick = () => {
    this.setState({ isModalActive: false });
  };

  onMyMenuClick = () => {
    const { isModalActive } = this.state;
    this.setState({ isModalActive: !isModalActive });
  };

  renderMyMenu() {
    const { userId, isExcelDownloading, dispatchStartExcelDownload } = this.props;
    const { isModalActive } = this.state;

    return userId ? (
      <div css={styles.myMenuWrapper}>
        <BetaBadge css={styles.BetaBadge} />
        <button id="MyMenuToggleButton" css={styles.myMenuToggleButton} onClick={this.onMyMenuClick} type="button">
          {isModalActive ? <MyMenuActiveIcon css={styles.myMenuActiveIcon} /> : <MyMenuIcon css={styles.myMenuIcon} />}
          <span css={Hidden}>마이메뉴</span>
        </button>
        <MyMenuModal
          userId={userId}
          isActive={isModalActive}
          isExcelDownloading={isExcelDownloading}
          dispatchStartExcelDownload={dispatchStartExcelDownload}
          onClickModalBackground={this.onModalBackgroundClick}
        />
      </div>
    ) : (
      <BetaBadge css={styles.BetaBadge} />
    );
  }

  render() {
    return (
      <>
        <Responsive css={styles.GNB}>
          <header css={styles.flexWrapper}>
            <div>
              <h1 css={styles.title}>
                <a css={styles.titleLink} href="/">
                  내 서재
                </a>
              </h1>
              <ul css={styles.familyServiceList}>
                <li css={styles.familyServiceItem}>
                  <a css={styles.familyServiceLink} href={RIDIBOOKS_URL}>
                    <LogoRidibooks css={styles.ridibooksIcon} />
                    <span css={Hidden}>RIDIBOOKS</span>
                  </a>
                </li>
                <li css={[styles.familyServiceItem, styles.familyServiceItemSeparator]}>
                  <a css={styles.familyServiceLink} href={RIDISELECT_URL}>
                    <LogoRidiselect css={styles.ridiSelectIcon} />
                    <span css={Hidden}>RIDI Select</span>
                  </a>
                </li>
              </ul>
            </div>
            {this.renderMyMenu()}
          </header>
        </Responsive>
      </>
    );
  }
}

const mapStateToProps = state => {
  const isExcelDownloading = getIsExcelDownloading(state);
  const userId = state.account.userInfo ? state.account.userInfo.id : null;
  return {
    userId,
    isExcelDownloading,
  };
};

const mapDispatchToProps = {
  dispatchStartExcelDownload: startExcelDownload,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GNB);
