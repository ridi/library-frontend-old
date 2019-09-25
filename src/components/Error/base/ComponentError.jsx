/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const styles = {
  errorWrapper: css`
    margin-top: 150px;
    margin-bottom: 150px;
    text-align: center;
  `,
  icon: css`
    width: 30px;
    height: 38px;
    fill: #d1d5d9;
    margin-bottom: 20px;
  `,
  message: css`
    font-size: 15px;
    color: #40474d;
    margin-bottom: 20px;
  `,
  refreshButton: css`
    width: 68px;
    height: 30px;
    border-radius: 4px;
    background-color: white;
    box-shadow: 1px 1px 1px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid #d1d5d9;

    font-size: 13px;
    font-weight: bold;
    color: #808991;
  `,
};

const ComponentError = ({ children, ErrorIcon, onClickRefreshButton }) => (
  <div css={styles.errorWrapper}>
    <ErrorIcon css={styles.icon} />
    <p css={styles.message}>{children}</p>
    {onClickRefreshButton && (
      <button type="button" onClick={onClickRefreshButton} css={styles.refreshButton}>
        새로고침
      </button>
    )}
  </div>
);

export default ComponentError;
