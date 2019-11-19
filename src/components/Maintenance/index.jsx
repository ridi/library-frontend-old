import { Global } from '@emotion/core';
import React from 'react';
import Helmet from 'react-helmet';

import RIDIIcon from '../../svgs/LogoRidi.svg';
import NoticeIcon from '../../svgs/NoticeFilled.svg';
import * as styles from './styles';

const ServiceList = ({ services }) => (
  <ul>
    {services.map(service => (
      <React.Fragment key={service}>
        <li>
          <div>{service}</div>
        </li>
      </React.Fragment>
    ))}
  </ul>
);

const Maintenance = ({ terms, unavailableServiceList }) => (
  <>
    <Helmet>
      <title>시스템 점검 중 - 내 서재</title>
    </Helmet>
    <header css={styles.header}>
      <RIDIIcon css={styles.logo} />
    </header>
    <section css={styles.maintenance}>
      <Global styles={styles.global} />
      <header>
        <h1>시스템 점검 안내</h1>
        <p>안녕하세요.</p>
        보다 나은 서비스 제공을 위해 시스템 점검을 실시합니다.
        <br />
        점검 중에는 일부 서비스 제공이 어려우니 양해 부탁드립니다.
      </header>
      <section>
        <NoticeIcon />
        <dl>
          <dt>점검 기간</dt>
          <dd>
            <ul>
              <li>{terms}</li>
            </ul>
          </dd>
          <dt>점검 기간 중 이용이 제한되는 서비스</dt>
          <dd>
            <ServiceList services={unavailableServiceList} />
          </dd>
        </dl>
      </section>
      <footer>
        언제나 편리하게 서비스를 이용하실 수 있도록 최선을 다하겠습니다.
        <br />
        감사합니다.
      </footer>
    </section>
  </>
);

export default Maintenance;
