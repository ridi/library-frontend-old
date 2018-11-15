import React from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import { getToast } from '../services/toast/selectors';
import { closeToast, closeWithDelay, cancelClose } from '../services/toast/actions';

class Toast extends React.Component {
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

  renderArrowIcon() {
    const {
      toast: { uri },
    } = this.props;

    if (!uri) {
      return null;
    }

    return (
      <button type="button" onClick={this.onClick}>
        이동
      </button>
    );
  }

  render() {
    const { toast } = this.props;
    if (toast === null) {
      return null;
    }

    return (
      <>
        <div onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
          {toast.message}
          {this.renderArrowIcon()}
        </div>
      </>
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
)(Toast);
