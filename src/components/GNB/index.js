import React from 'react';
import { Icon } from '@ridi/rsg';
import GNBPopup from './GNBPopup';

export default class GNB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopupActive: false,
    };
  }

  render() {
    const { ridibooksUrl, ridiSelectUrl, userId } = this.props;
    const { isPopupActive } = this.state;
    return (
      <header>
        <div>
          <h1>내 서재</h1>
          <ul>
            <li>
              <a href={ridibooksUrl}>
                <Icon name="logo_ridibooks_1" />
                RIDIBOOKS
              </a>
            </li>
            <li>
              <a href={ridiSelectUrl}>
                <Icon name="logo_ridiselect_1" />
                RIDI Select
              </a>
            </li>
          </ul>
        </div>
        <div>
          <button type="button">마이리디</button>
          {isPopupActive && <GNBPopup userId={userId} />}
        </div>
      </header>
    );
  }
}
