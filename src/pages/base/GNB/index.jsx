/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { Icon } from '@ridi/rsg';
import { jsx } from '@emotion/core';
import { startExcelDownload } from '../../../services/excelDownload/actions';
import { getIsExcelDownloading } from '../../../services/excelDownload/selectors';
import MyMenuModal from '../Modal/MyMenuModal';
import * as styles from './styles';
import { Hidden } from '../../../styles';
import MyMenu from '../../../svgs/MyMenu.svg';
import Responsive from '../Responsive';
import { ModalBackground } from '../../../components/Modal';

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

  render() {
    const { userId, isExcelDownloading, dispatchStartExcelDownload } = this.props;
    const { isModalActive } = this.state;
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
                    <Icon css={styles.ridibooksIcon} name="logo_ridibooks_1" />
                    <span css={Hidden}>RIDIBOOKS</span>
                  </a>
                </li>
                <li css={[styles.familyServiceItem, styles.familyServiceItemSeparator]}>
                  <a css={styles.familyServiceLink} href={RIDISELECT_URL}>
                    <Icon css={styles.ridiSelectIcon} name="logo_ridiselect_1" />
                    <span css={Hidden}>RIDI Select</span>
                  </a>
                </li>
              </ul>
            </div>
            <div css={styles.myMenuWrapper}>
              <button id="MyMenuToggleButton" css={styles.myMenuToggleButton} onClick={this.onMyMenuClick} type="button">
                <MyMenu css={styles.myMenuIcon(isModalActive)} />
                <span css={Hidden}>마이메뉴</span>
              </button>
            </div>
            <MyMenuModal
              userId={userId}
              isActive={isModalActive}
              isExcelDownloading={isExcelDownloading}
              dispatchStartExcelDownload={dispatchStartExcelDownload}
            />
          </header>
        </Responsive>
        <ModalBackground isActive={isModalActive} onClickModalBackground={this.onModalBackgroundClick} />
      </>
    );
  }
}

const mapStateToProps = state => {
  const isExcelDownloading = getIsExcelDownloading(state);
  const { id: userId } = state.account.userInfo;
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
