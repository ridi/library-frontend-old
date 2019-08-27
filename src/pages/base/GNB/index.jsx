/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';
import MyMenuModal from '../../../components/Modal/MyMenuModal';
import config from '../../../config';
import { startExcelDownload } from '../../../services/excelDownload/actions';
import { getIsExcelDownloading } from '../../../services/excelDownload/selectors';
import { Hidden } from '../../../styles';
import LogoRidibooks from '../../../svgs/LogoRidibooks.svg';
import LogoRidiselect from '../../../svgs/LogoRidiselect.svg';
import MyMenuActiveIcon from '../../../svgs/MyMenu-active.svg';
import MyMenuIcon from '../../../svgs/MyMenu.svg';
import Responsive from '../Responsive';
import * as styles from './styles';

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

  renderFamilyServiceIcons = () => (
    <ul css={styles.familyServiceList}>
      <li css={styles.familyServiceItem}>
        <a css={styles.familyServiceLink} href={config.STORE_BASE_URL}>
          <LogoRidibooks css={styles.ridibooksIcon} />
          <span css={Hidden}>RIDIBOOKS</span>
        </a>
      </li>
      <li css={[styles.familyServiceItem, styles.familyServiceItemSeparator]}>
        <a css={styles.familyServiceLink} href={config.SELECT_BASE_URL}>
          <LogoRidiselect css={styles.ridiSelectIcon} />
          <span css={Hidden}>RIDI Select</span>
        </a>
      </li>
    </ul>
  );

  renderMyMenu = () => {
    const { userId, isExcelDownloading, dispatchStartExcelDownload } = this.props;
    const { isModalActive } = this.state;

    return (
      <>
        {userId ? (
          <button id="MyMenuToggleButton" css={styles.myMenuToggleButton} onClick={this.onMyMenuClick} type="button">
            {isModalActive ? <MyMenuActiveIcon css={styles.myMenuActiveIcon} /> : <MyMenuIcon css={styles.myMenuIcon} />}
            <span css={Hidden}>마이메뉴</span>
          </button>
        ) : (
          <button id="MyMenuToggleButton" css={styles.myMenuToggleButton} type="button">
            {<MyMenuIcon css={styles.myMenuInactiveIcon} />}
            <span css={Hidden}>마이메뉴</span>
          </button>
        )}

        {userId ? (
          <MyMenuModal
            userId={userId}
            isActive={isModalActive}
            isExcelDownloading={isExcelDownloading}
            dispatchStartExcelDownload={dispatchStartExcelDownload}
            onClickModalBackground={this.onModalBackgroundClick}
          />
        ) : null}
      </>
    );
  };

  renderRightUi() {
    return (
      <div css={styles.myMenuWrapper}>
        {this.renderFamilyServiceIcons()}
        {this.renderMyMenu()}
      </div>
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
            </div>
            {this.renderRightUi()}
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
