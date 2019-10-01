import React from 'react';
import Close from '../../svgs/Close.svg';
import { disableScroll, enableScroll } from '../../utils/scroll';
import IconButton from '../IconButton';
import * as styles from './styles';

export default class Dialog extends React.Component {
  componentDidMount() {
    disableScroll();
  }

  componentWillUnmount() {
    enableScroll();
  }

  render() {
    const { title, message, onClickCloseButton } = this.props;
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
            <button type="button" css={styles.dialogButton} onClick={onClickCloseButton}>
              확인
            </button>
            <div css={styles.clear} />
          </div>
        </div>
      </div>
    );
  }
}
