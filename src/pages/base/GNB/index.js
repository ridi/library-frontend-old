import React from 'react';
import { connect } from 'react-redux';
import { Icon } from '@ridi/rsg';
import MyMenuModal from '../MyMenuModal';
import * as styles from './styles';
import { hidden } from '../../../styles';

class GNB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalActive: false,
    };
  }

  onClickMyMenu = () => {
    const { isModalActive } = this.state;
    this.setState({ isModalActive: !isModalActive });
  };

  render() {
    const { ridibooksUrl, ridiSelectUrl, userId } = this.props;
    const { isModalActive } = this.state;
    return (
      <header className={styles.GNB}>
        <div className={styles.FlexWrapper}>
          <div>
            <h1 className={styles.Title}>
              <a className={styles.TitleLink} href="/">
                내 서재
              </a>
            </h1>
            <ul className={styles.FamilyServiceList}>
              <li className={styles.FamilyServiceItem}>
                <a className={styles.FamilyServiceLink} href={ridibooksUrl}>
                  <Icon className={styles.RidibooksIcon} name="logo_ridibooks_1" />
                  <span className={hidden}>RIDIBOOKS</span>
                </a>
              </li>
              <li className={styles.FamilyServiceItem}>
                <a className={styles.FamilyServiceLink} href={ridiSelectUrl}>
                  <Icon className={styles.RidiSelectIcon} name="logo_ridiselect_1" />
                  <span className={hidden}>RIDI Select</span>
                </a>
              </li>
            </ul>
          </div>
          <div className={styles.MyMenuWrapper}>
            <button className={styles.MyMenuToggleButton} onClick={this.onClickMyMenu} type="button">
              <Icon className={`${styles.MyMenuIcon} ${isModalActive ? styles.IconRotate : ''}`} name="setting_1" />
              <span className={hidden}>마이메뉴</span>
            </button>
            <MyMenuModal userId={userId} isActive={isModalActive} />
          </div>
        </div>
      </header>
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
