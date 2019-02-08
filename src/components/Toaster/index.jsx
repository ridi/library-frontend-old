/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { jsx } from '@emotion/core';
import Link from 'next/link';

import { getToast } from '../../services/toast/selectors';
import { closeToast, closeWithDelay, cancelClose } from '../../services/toast/actions';

import * as styles from './styles';
import IconButton from '../IconButton';

class Toaster extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  onClick() {
    const {
      toast: { uri },
      closeToast: dispatchCloseToast,
    } = this.props;

    dispatchCloseToast();
    Router.push(uri);
  }

  onMouseOver() {
    const { cancelClose: dispatchCancelClose } = this.props;
    dispatchCancelClose();
  }

  onMouseOut() {
    const {
      toast: { duration },
      closeWithDelay: dispatchCloseWithDelay,
    } = this.props;
    dispatchCloseWithDelay(duration);
  }

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
      />
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
          <div css={styles.toastTypeMark} />
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
