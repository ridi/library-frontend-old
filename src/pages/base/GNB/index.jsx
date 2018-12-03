import React from 'react';
import { connect } from 'react-redux';
import { Icon } from '@ridi/rsg';
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
        <header className={styles.GNB}>
          <Responsive className={styles.FlexWrapper}>
            <div>
              <h1 className={styles.Title}>
                <a className={styles.TitleLink} href="/">
                  내 서재
                </a>
              </h1>
              <ul className={styles.FamilyServiceList}>
                <li className={styles.FamilyServiceItem}>
                  <a className={styles.FamilyServiceLink} href={RIDIBOOKS_URL}>
                    <Icon className={styles.RidibooksIcon} name="logo_ridibooks_1" />
                    <span className={Hidden}>RIDIBOOKS</span>
                  </a>
                </li>
                <li className={styles.FamilyServiceItem}>
                  <a className={styles.FamilyServiceLink} href={RIDISELECT_URL}>
                    <Icon className={styles.RidiSelectIcon} name="logo_ridiselect_1" />
                    <span className={Hidden}>RIDI Select</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.MyMenuWrapper}>
              <button id="MyMenuToggleButton" className={styles.MyMenuToggleButton} onClick={this.onMyMenuClick} type="button">
                <MyMenu className={styles.MyMenuIcon(isModalActive)} />
                <span className={Hidden}>마이메뉴</span>
              </button>
            </div>
            <MyMenuModal userId={userId} isActive={isModalActive} />
          </Responsive>
        </header>
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
