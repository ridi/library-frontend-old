/** @jsx jsx */
import { jsx } from '@emotion/core';
import FooterPaperIcon from '../../../svgs/FooterPaperIcon.svg';
import FooterNewIcon from '../../../svgs/FooterNewIcon.svg';
import * as styles from './styles';

const Footer = () => (
  <>
    <div css={styles.footerMargin} />
    <footer css={styles.footer}>
      <div css={styles.footerWrapper}>
        <div>
          <ul css={styles.headingList}>
            <li css={styles.headingItem}>1644-0331</li>
            <li css={[styles.headingItem, styles.verticalSeparator]}>
              <a href="https://help.ridibooks.com/hc/ko/" target="_blank">
                고객센터
              </a>
            </li>
          </ul>
          <ul css={styles.contentList}>
            <li css={styles.contentItem}>
              <a href="https://paper.ridibooks.com/" target="_blank" rel="noopener noreferrer">
                <FooterPaperIcon css={styles.footerPaperIcon} />
              </a>
            </li>
            <li css={[styles.contentItem, styles.hideInMobile]}>
              <a href="https://www.facebook.com/ridibooks" target="_blank" rel="noopener noreferrer">
                페이스북
              </a>
            </li>
            <li css={styles.contentItem}>
              <a href="https://www.ridicorp.com/" target="_blank" rel="noopener noreferrer">
                회사 소개
              </a>
            </li>
            <li css={styles.contentItem}>
              <a href="https://ridibooks.com/support/app/download" target="_blank" rel="noopener noreferrer">
                뷰어 다운로드
              </a>
            </li>
            <li css={[styles.contentItem, styles.hideInMobile]}>
              <a href="https://instagram.com/ridibookspaper/" target="_blank" rel="noopener noreferrer">
                인스타그램
              </a>
            </li>
            <li css={styles.contentItem}>
              <a href="https://www.ridicorp.com/career/" target="_blank" rel="noopener noreferrer">
                인재 채용
                <FooterNewIcon css={styles.footerNewIcon} />
              </a>
            </li>
          </ul>
        </div>
        <div css={styles.footerTermWrapper}>
          <div css={styles.copyright}>© RIDI Corp.</div>
          <ul css={styles.termsList}>
            <li css={styles.termsItem}>
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
            <li css={[styles.termsItem, styles.verticalSeparator]}>
              <a href="http://ftc.go.kr/info/bizinfo/communicationList.jsp" target="_blank" rel="noopener noreferrer">
                사업자 정보 확인
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;
