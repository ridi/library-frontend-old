/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { Icon } from '@ridi/rsg';
import { jsx } from '@emotion/core';
import MyMenuModal from '../MyMenuModal';
import * as styles from './styles';
import { Hidden } from '../../../styles';
import MyMenu from '../../../svgs/MyMenu.svg';
import Responsive from '../Responsive';

import ModalBackground from '../../../components/ModalBackground';

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

  renderModalBackground() {
    const { showFilterModal, showMoreModal } = this.state;
    return <ModalBackground isActive={showFilterModal || showMoreModal} onClickModalBackground={this.handleOnClickOutOfModal} />;
  }

  render() {
    const { userId } = this.props;
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
            <MyMenuModal userId={userId} isActive={isModalActive} />
          </header>
        </Responsive>
        <ModalBackground isActive={isModalActive} onClickModalBackground={this.onModalBackgroundClick} />
      </>
    );
  }
}

const mapStateToProps = state => {
  const { id: userId } = state.account.userInfo;
  return {
    userId,
  };
};

export default connect(mapStateToProps)(GNB);
