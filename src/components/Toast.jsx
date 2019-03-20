/** @jsx jsx */
import React from 'react';
import { connect } from 'react-redux';
import { jsx } from '@emotion/core';
import { isAfter } from 'date-fns';

import { showToast } from '../services/toast/actions';
import { Duration, ToastStyle } from '../services/toast/constants';
import Cookies from '../utils/cookies';

class Toast extends React.Component {
  componentDidMount() {
    const {
      name,
      expires,
      showToast: dispatchShowToast,
      message,
      linkName,
      linkProps,
      outLink,
      duration = Duration.NORMAL,
      toastStyle = ToastStyle.GREEN,
    } = this.props;

    if (expires && isAfter(new Date(), expires)) {
      return;
    }

    const _cookie = Cookies.get(null, name);
    if (!_cookie) {
      Cookies.set(null, name, true, { path: '/', expires });
      dispatchShowToast(message, linkName, linkProps, outLink, duration, toastStyle);
    }
  }

  render() {
    return <></>;
  }
}

const mapDispatchToProps = { showToast };
export default connect(
  null,
  mapDispatchToProps,
)(Toast);
