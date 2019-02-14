/** @jsx jsx */
import { jsx } from '@emotion/core';
import LogoRidibooksApp from '../../../svgs/LogoRidibooksApp.svg';
import * as styles from './styles';

const Footer = () => (
  <>
    <div css={styles.footerMargin} />
    <footer css={styles.footer}>
      <div css={styles.contentsWrapper}>
        <ul className="HeadlineList">
          <li css={styles.headlineItem}>
            <a css={styles.headlineLink} href="https://ridibooks.com/support/app/download" target="_blank" rel="noopener noreferrer">
              <LogoRidibooksApp css={styles.ridibooksLogoIcon} />
              뷰어 다운로드
            </a>
          </li>
          <li css={[styles.headlineItem, styles.headlineItemSeparator]}>
            <a css={styles.headlineLink} href="/guide">
              고객센터
            </a>
          </li>
        </ul>
        <ul css={styles.bizInfoList}>
          <li css={styles.infoItem}>서울시 강남구 역삼동 702-28 어반벤치빌딩 10층(테헤란로 325)</li>
          <li css={styles.infoItem}>
            <ul className="CompanyInfoList">
              <li css={styles.infoItem}>리디 (주)</li>
              <li css={styles.infoItem}>대표 배기식</li>
              <li css={styles.infoItem}>사업자등록번호 120-87-27435</li>
            </ul>
          </li>
          <li css={styles.infoItem}>통신판매업신고 제 2009-서울강남 35-02139호</li>
          <li css={styles.infoItem}>개인정보보호책임자 security@ridi.com</li>
        </ul>
        <ul css={styles.termsList}>
          <li css={styles.termsItem}>
            <a css={styles.termLink} href="https://ridibooks.com/legal/terms" target="_blank" rel="noopener noreferrer">
              이용약관
            </a>
          </li>
          <li css={[styles.termsItem, styles.tersItemSeparator]}>
            <a css={styles.termLink} href="https://ridibooks.com/legal/privacy" target="_blank" rel="noopener noreferrer">
              <strong>개인 정보 처리 방침</strong>
            </a>
          </li>
          <li css={[styles.termsItem, styles.tersItemSeparator]}>
            <a css={styles.termLink} href="https://ridibooks.com/legal/youth" target="_blank" rel="noopener noreferrer">
              청소년 보호 정책
            </a>
          </li>
        </ul>
        <p css={styles.copyright}>© RIDI Corp.</p>
      </div>
    </footer>
  </>
);

export default Footer;
