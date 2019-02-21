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
    const { title, message, confirmLabel = '확인', onClickCloseButton } = this.props;
    return (
      <div css={styles.dialogWrapper}>
        <div css={styles.dialog}>
          <div css={styles.dialogHeader}>
            <div css={styles.dialogTitle}>{title}</div>
            <IconButton a11y="닫기버튼" css={styles.dialogCloseButton} onClick={onClickCloseButton}>
              <Close />
            </IconButton>
          </div>
          <div css={styles.dialogContent}>{message}</div>
          <div css={styles.dialogFooter}>
            <button type="button" css={styles.agreeButton} onClick={onClickCloseButton}>
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
