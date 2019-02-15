/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import NotFoundErrorIcon from '../../svgs/NotFoundErrorIcon.svg';

const styles = {
  pageError: {
    textAlign: 'center',
    padding: '60px 0',
  },
  errorTitle: {
    margin: '8px 0',
    fontSize: 60,
    color: '#303538',
  },
  errorDescription: {
    margin: '20px 0',
    fontSize: 18,
    lineHeight: '1.6em',
    color: '#525A61',
  },
  errorButtonWrapper: {
    display: 'inline-block',
    marginTop: 36,
  },
  errorButton: {
    display: 'inline-block',
    width: 140,
    padding: '14px 0',
    margin: '0 2px',
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'background .2s, color .2s',
    outline: 'none',
    boxSizing: 'border-box',
    borderRadius: 4,
    appearance: 'none',
  },
  whiteButton: {
    color: '#808991',
    background: '#fff',
    border: '1px solid #d1d5d9',
    boxShadow: '0 1px 1px 0 rgba(209,213,217,.3)',
  },
  grayButton: {
    color: '#FFFFFF',
    background: '#808991',
    border: '1px solid #798086',
    boxShadow: '0 1px 1px 0 rgba(209,213,217,.3)',
  },

  icon: {
    width: 94,
    height: 79,
  },
};

export const NotFoundError = ({ onClickHistoryBack }) => (
  <>
    <Head>
      <title>404</title>
    </Head>
    <section css={styles.pageError}>
      <div>
        <NotFoundErrorIcon css={styles.icon} />
      </div>
      <h2 css={styles.errorTitle}>404</h2>
      <p css={styles.errorDescription}>
        <strong>요청하신 페이지가 없습니다.</strong>
        <br />
        입력하신 주소를 확인해 주세요.
      </p>
      <ul>
        <li css={styles.errorButtonWrapper}>
          <a css={[styles.errorButton, styles.whiteButton]} href="#">
            이전페이지
          </a>
        </li>
        <li css={styles.errorButtonWrapper}>
          <a css={[styles.errorButton, styles.grayButton]} href="#">
            홈으로 돌아가기
          </a>
        </li>
      </ul>
    </section>
  </>
);
