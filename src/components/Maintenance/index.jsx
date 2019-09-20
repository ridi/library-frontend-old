/** @jsx jsx */
import { Global, jsx } from '@emotion/core';
import React from 'react';
import Helmet from 'react-helmet';
import { generate } from 'shortid';
import * as styles from './styles';

const Maintenance = ({ terms, unavailableServiceList }) => (
  <React.Fragment>
    <Helmet>
      <title>시스템 점검 중 - 내 서재</title>
    </Helmet>
    <section css={styles.maintenance}>
      <Global styles={styles.global} />
      <h1 css={styles.title}>시스템 점검 안내</h1>
      <article css={styles.description}>
        <h2 css={styles.termsTitle}>점검기간</h2>
        <p css={styles.terms}>{terms}</p>
        {unavailableServiceList && unavailableServiceList.length > 0 && (
          <>
            <h2 css={styles.serviceListTitle}>점검 기간 중 이용이 제한되는 서비스</h2>
            <ul css={styles.unavailableServiceList}>
              {unavailableServiceList.map(service => (
                <li key={`unavailableServiceList${generate()}`} css={styles.service}>
                  - {service}
                </li>
              ))}
            </ul>
          </>
        )}
      </article>
      <p css={styles.footer}>
        보다 나은 서비스를 제공해 드리기 위한 시스템 점검으로, 이용에 불편함을 드리게 된 점 양해 부탁드립니다.
        <br />
        언제나 편리하고 즐겁게 리디북스를 이용하실 수 있도록 최선을 다하겠습니다.
        <br />
        감사합니다.
        <br />
        <br />
        <strong>리디북스 드림.</strong>
      </p>
    </section>
  </React.Fragment>
);

export default Maintenance;
