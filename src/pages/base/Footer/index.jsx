import React from 'react';
import * as styles from './styles';
import config from '../../../config';

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
                <a href={config.HELP_BASE_URL} target="_blank" rel="noopener noreferrer">
                  고객센터
                </a>
              </li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href={`${config.POLICY_BASE_URL}/legal/terms`} target="_blank" rel="noopener noreferrer">
                  이용약관
                </a>
              </li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href={`${config.POLICY_BASE_URL}/legal/privacy`} target="_blank" rel="noopener noreferrer">
                  <strong>개인 정보 처리 방침</strong>
                </a>
              </li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href={`${config.POLICY_BASE_URL}/legal/youth`} target="_blank" rel="noopener noreferrer">
                  청소년 보호 정책
                </a>
              </li>
              <li css={[styles.termsItem]}>
                <a
                  href="http://ftc.go.kr/www/bizCommView.do?key=232&apv_perm_no=2009322012730202139"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  사업자 정보 확인
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
