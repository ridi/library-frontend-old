/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import ErrorBook from '../../svgs/ErrorBook.svg';
import * as styles from './styles';

const onClickHistoryBack = () => {
  window.history.back();
};

export const NotFoundError = () => (
  <>
    <Head>
      <title>404 에러 - 내 서재</title>
    </Head>
    <section css={styles.pageError}>
      <div>
        <ErrorBook css={styles.icon} />
      </div>
      <h2 css={styles.errorTitle}>404</h2>
      <p css={styles.errorDescription}>
        <strong>요청하신 페이지가 없습니다.</strong>
        <br />
        입력하신 주소를 확인해 주세요.
      </p>
      <ul>
        <li css={styles.errorButtonWrapper}>
          <button type="button" css={[styles.errorButton, styles.whiteButton]} onClick={onClickHistoryBack}>
            이전페이지
          </button>
        </li>
        <li css={styles.errorButtonWrapper}>
          <a css={[styles.errorButton, styles.grayButton]} href="/">
            홈으로 돌아가기
          </a>
        </li>
      </ul>
    </section>
  </>
);
