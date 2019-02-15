/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import InternalErrorIcon from '../../svgs/InternalErrorIcon.svg';

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
  icon: {
    width: 94,
    height: 79,
  },
};

export const InternalError = ({ onClickHistoryBack }) => (
  <>
    <Head>
      <title>500 Internal Server Error - 리디</title>
    </Head>
    <section css={styles.pageError}>
      <div>
        <InternalErrorIcon css={styles.icon} />
      </div>
      <h2 css={styles.errorTitle}>500</h2>
      <p css={styles.errorDescription}>
        <strong>지금은 접속이 어렵습니다.</strong>
        <br />
        현재 오류 복구에 최선을 다하고 있으니,
        <br /> 잠시 후 다시 접속해주세요.
      </p>
      <ul>
        <li css={styles.errorButtonWrapper}>
          <button type="button" css={[styles.errorButton, styles.whiteButton]} onClick={onClickHistoryBack}>
            이전페이지
          </button>
        </li>
      </ul>
    </section>
  </>
);
