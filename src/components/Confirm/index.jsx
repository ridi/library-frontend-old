/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import Close from '../../svgs/Close.svg';
import { disableScroll, enableScroll } from '../../utils/scroll';
import IconButton from '../IconButton';
import * as styles from './styles';

export default class Confirm extends React.Component {
  componentDidMount() {
    disableScroll();
  }

  componentWillUnmount() {
    enableScroll();
  }

  render() {
    const { title, message, confirmLabel = '확인', onClickCloseButton, onClickConfirmButton } = this.props;

    return (
      <div css={styles.confirmWrapper}>
        <div css={styles.confirm}>
          <div css={styles.confirmHeader}>
            <div css={styles.confirmTitle}>{title}</div>
            <IconButton a11y="닫기버튼" css={styles.confirmCloseButton} onClick={onClickCloseButton}>
              <Close />
            </IconButton>
          </div>
          <div css={styles.confirmContent}>{message}</div>
          <div css={styles.confirmFooter}>
            <button
              type="button"
              css={styles.confirmButton}
              onClick={() => {
                onClickConfirmButton();
                onClickCloseButton();
              }}
            >
              {confirmLabel}
            </button>
            <button type="button" css={styles.cancelButton} onClick={onClickCloseButton}>
              취소
            </button>
            <div css={styles.clear} />
          </div>
        </div>
      </div>
    );
  }
}
