/** @jsx jsx */
import { jsx } from '@emotion/core';
import FooterNewIcon from '../../../svgs/FooterNewIcon.svg';
import FooterPaperIcon from '../../../svgs/FooterPaperIcon.svg';
import * as styles from './styles';

const Footer = () => (
  <>
    <div css={styles.footerMargin} />
    <footer css={styles.footer}>
      <div css={styles.footerWrapper}>
        <div css={styles.footerTermWrapper}>
          <div css={styles.copyright}>© RIDI Corp.</div>
          <div>
            <ul css={styles.termsList}>
              <li css={[styles.termsItem, styles.verticalSeparator]}>1644-0331</li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href="https://help.ridibooks.com/hc/ko/" target="_blank" rel="noopener noreferrer">
                  고객센터
                </a>
              </li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href="https://ridibooks.com/legal/terms" target="_blank" rel="noopener noreferrer">
                  이용약관
                </a>
              </li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href="https://ridibooks.com/legal/privacy" target="_blank" rel="noopener noreferrer">
                  <strong>개인 정보 처리 방침</strong>
                </a>
              </li>
              <li css={[styles.termsItem, styles.verticalSeparator]}>
                <a href="https://ridibooks.com/legal/youth" target="_blank" rel="noopener noreferrer">
                  청소년 보호 정책
                </a>
              </li>
              <li css={[styles.termsItem]}>
                <a href="http://ftc.go.kr/info/bizinfo/communicationList.jsp" target="_blank" rel="noopener noreferrer">
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
