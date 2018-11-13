import React from 'react';
import { Icon } from '@ridi/rsg';
import MyMenuModal from './MyMenuModal';

export default class Header extends React.Component {
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
          {isModalActive && <MyMenuModal userId={userId} />}
        </div>
      </header>
    );
  }
}
