/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';
import { cancelClose, closeToast, closeWithDelay } from '../../services/toast/actions';
import { getToast } from '../../services/toast/selectors';
import Check from '../../svgs/CheckCircleFill.svg';
import ArrowIcon from '../../svgs/NoneDashedDoubleArrowRight.svg';
import Close from '../../svgs/Close.svg';
import IconButton from '../IconButton';
import * as styles from './styles';

class Toaster extends React.Component {
  onMouseOver = () => {
    const { cancelClose: dispatchCancelClose } = this.props;
    dispatchCancelClose();
  };

  onMouseOut = () => {
    const {
      toast: { duration },
      closeWithDelay: dispatchCloseWithDelay,
    } = this.props;
    dispatchCloseWithDelay(duration);
  };

  renderToastLink() {
    const {
      toast: { linkName, linkProps, outLink },
      closeToast: dispatchCloseToast,
    } = this.props;

    if (linkProps) {
      return (
        <Link prefetch {...linkProps}>
          <button
            css={styles.toastLink}
            type="button"
            onClick={() => {
              dispatchCloseToast();
            }}
          >
            {linkName}
            <ArrowIcon css={styles.toastLinkArrowIcon} />
          </button>
        </Link>
      );
    }

    if (outLink) {
      return (
        <a
          css={styles.toastLink}
          onClick={() => {
            dispatchCloseToast();
          }}
          href={outLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkName}
          <ArrowIcon css={styles.toastLinkArrowIcon} />
        </a>
      );
    }

    return null;
  }

  renderCloseButton() {
    const { closeToast: dispatchCloseToast } = this.props;
    return (
      <IconButton
        css={styles.toastCloseButton}
        onClick={() => {
          dispatchCloseToast();
        }}
        a11y="닫기버튼"
      >
        <Close />
      </IconButton>
    );
  }

  render() {
    const { toast } = this.props;
    if (toast === null) {
      return null;
    }

    return (
      <div css={styles.toastWrapper}>
        <div css={styles.toast} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
          <div css={styles.toastTypeMark}>
            <Check css={styles.toastTypeMarkIcon(toast.toastStyle)} />
          </div>
          <div css={styles.toastContent(toast.toastStyle)}>
            <span css={styles.toastContentMessage}>{toast.message}</span>
            {this.renderToastLink()}
          </div>
          {this.renderCloseButton()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  toast: getToast(state),
});

const mapDispatchToProps = {
  closeToast,
  closeWithDelay,
  cancelClose,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Toaster);
