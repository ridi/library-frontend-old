/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Icon } from '@ridi/rsg';
import * as styles from './styles';

const Footer = () => (
  <footer css={styles.Footer}>
    <div css={styles.ContentsWrapper}>
      <ul className="HeadlineList">
        <li css={styles.HeadlineItem}>
          <a css={styles.HeadlineLink} href="https://ridibooks.com/support/app/download" target="_blank" rel="noopener noreferrer">
            <Icon css={styles.RidibooksLogoIcon} name="app_ridi_1" />
            뷰어 다운로드
          </a>
        </li>
        <li css={styles.HeadlineItem}>
          <a css={styles.HeadlineLink} href="/guide">
            고객센터
          </a>
        </li>
      </ul>
      <ul css={styles.BizInfoList}>
        <li css={styles.InfoItem}>서울시 강남구 역삼동 702-28 어반벤치빌딩 10층(테헤란로 325)</li>
        <li css={styles.InfoItem}>
          <ul css="CompanyInfoList">
            <li css={styles.InfoItem}>리디 (주)</li>
            <li css={styles.InfoItem}>대표 배기식</li>
            <li css={styles.InfoItem}>사업자등록번호 120-87-27435</li>
          </ul>
        </li>
        <li css={styles.InfoItem}>통신판매업신고 제 2009-서울강남 35-02139호</li>
        <li css={styles.InfoItem}>개인정보보호책임자 security@ridi.com</li>
      </ul>
      <ul css={styles.TermsList}>
        <li css={styles.TermsItem}>
          <a css={styles.TermLink} href="https://ridibooks.com/legal/terms" target="_blank" rel="noopener noreferrer">
            이용약관
          </a>
        </li>
        <li css={styles.TermsItem}>
          <a css={styles.TermLink} href="https://ridibooks.com/legal/privacy" target="_blank" rel="noopener noreferrer">
            <strong>개인 정보 처리 방침</strong>
          </a>
        </li>
        <li css={styles.TermsItem}>
          <a css={styles.TermLink} href="https://ridibooks.com/legal/youth" target="_blank" rel="noopener noreferrer">
            청소년 보호 정책
          </a>
        </li>
      </ul>
      <p css={styles.Copyright}>© RIDI Corp.</p>
    </div>
  </footer>
);

export default Footer;
