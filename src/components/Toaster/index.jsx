/** @jsx jsx */
import { jsx } from '@emotion/core';
import Link from 'next/link';
import React from 'react';
import { connect } from 'react-redux';
import { cancelClose, closeToast, closeWithDelay } from '../../services/toast/actions';
import { getToast } from '../../services/toast/selectors';
import Check from '../../svgs/CheckCircleFill.svg';
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
      toast: { linkName, linkProps },
      closeToast: dispatchCloseToast,
    } = this.props;

    if (!linkProps) {
      return null;
    }

    return (
      <Link {...linkProps}>
        <button
          css={styles.toastLink}
          type="button"
          onClick={() => {
            dispatchCloseToast();
          }}
        >
          {linkName}
        </button>
      </Link>
    );
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
            <Check css={styles.toastTypeMarkIcon} />
          </div>
          <div css={styles.toastContent}>
            {toast.message}
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
