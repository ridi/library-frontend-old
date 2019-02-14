/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Icon } from '@ridi/rsg';
import { white } from 'ansi-colors';

const styles = {
  errorWrapper: {
    textAlign: 'center',
  },

  icon: {
    width: 30,
    height: 38,
    fill: '#d1d5d9',
    marginBottom: 20,
  },

  message: {
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#40474d',
    marginBottom: 20,
  },

  refreshButton: {
    width: 68,
    height: 30,
    borderRadius: 4,
    backgroundColor: 'white',
    boxShadow: '1px 1px 1px 0 rgba(0, 0, 0, 0.05)',
    border: '1px solid #d1d5d9',

    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    color: '#808991',
  },
};

export const Error = ({ onClickRefreshButton }) => (
  <div>
    <div css={styles.errorWrapper}>
      <Icon name="book_5" css={styles.icon} />
      <p css={styles.message}>
        도서의 정보 구성 중 오류가 발생했습니다.
        <br />
        잠시 후 다시 시도해주세요.
      </p>
      <button type="button" onClick={onClickRefreshButton} css={styles.refreshButton}>
        새로고침
      </button>
    </div>
  </div>
);
