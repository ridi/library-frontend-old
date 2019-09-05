/** @jsx jsx */
import { jsx } from '@emotion/core';
import Helmet from 'react-helmet';
import ErrorBook from '../../svgs/ErrorBook.svg';
import * as styles from './styles';

const onClickReload = () => {
  window.location.reload();
};

export const InternalError = () => (
  <>
    <Helmet>
      <title>500 에러 - 내 서재</title>
    </Helmet>
    <section css={styles.pageError}>
      <div>
        <ErrorBook css={styles.icon} />
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
          <button type="button" css={[styles.errorButton, styles.whiteButton]} onClick={onClickReload}>
            새로 고침
          </button>
        </li>
      </ul>
    </section>
  </>
);
