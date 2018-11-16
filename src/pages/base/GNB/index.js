import React from 'react';
import { Icon } from '@ridi/rsg';
import MyMenuModal from './MyMenuModal';
import { hidden } from '../../../styles';

export default class GNB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalActive: false,
    };
  }

  render() {
    const { ridibooksUrl, ridiSelectUrl, userId } = this.props;
    const { isModalActive } = this.state;
    return (
      <header className="GNB">
        <div className="GNB_TitleWrapper">
          <h1 className="GNB_Title">
            <a className="TitleLink" href="/">
              내 서재
            </a>
          </h1>
          <ul className="GNB_OtherService_List">
            <li className="GNB_OtherService_Item">
              <a className="OtherServiceLink" href={ridibooksUrl}>
                <Icon className="ServiceIcon_Ridibooks" name="logo_ridibooks_1" />
                <span className={hidden}>RIDIBOOKS</span>
              </a>
            </li>
            <li>
              <a href={ridiSelectUrl}>
                <Icon name="logo_ridiselect_1" />
                <span className={hidden}>RIDI Select</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="GNB_MyMenuWrapper">
          <button className="MyMenu_ToggleButton" type="button">
            마이메뉴
          </button>
          {isModalActive && <MyMenuModal userId={userId} />}
        </div>
      </header>
    );
  }
}
