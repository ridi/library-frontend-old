/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import FooterNewIcon from '../../../svgs/FooterNewIcon.svg';
import FooterPaperIcon from '../../../svgs/FooterPaperIcon.svg';
import * as styles from './styles';

const Footer = () => (
  <>
    <div css={styles.footerMargin} />
    <footer css={styles.footer}>
      <div css={styles.footerWrapper}>
        <div css={styles.footerTermWrapper}>
          <p css={styles.copyright}>© RIDI Corp.</p>
          <div>
            <ul css={styles.termsList}>
              <li css={[styles.termsItem, styles.verticalSeparator]}>1644-0331</li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href="https://help.ridibooks.com/hc/ko/">고객센터</a>
              </li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href="https://ridibooks.com/legal/terms">이용약관</a>
              </li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href="https://ridibooks.com/legal/privacy">
                  <strong>개인 정보 처리 방침</strong>
                </a>
              </li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href="https://ridibooks.com/legal/youth">청소년 보호 정책</a>
              </li>
              <li css={[styles.termsItem]}>
                <a href="http://ftc.go.kr/info/bizinfo/communicationList.jsp">사업자 정보 확인</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
