import isAfter from 'date-fns/is_after';
import React from 'react';
import { connect } from 'react-redux';
import { showToast } from '../services/toast/actions';
import { Duration, ToastStyle } from '../services/toast/constants';
import settings from '../utils/settings';

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

    const _val = settings.get(name);
    if (!_val) {
      settings.set(name, true, { path: '/', expires });
      dispatchShowToast({
        message,
        linkName,
        linkProps,
        outLink,
        duration,
        toastStyle,
      });
    }
  }

  render() {
    return null;
  }
}

const mapDispatchToProps = { showToast };
export default connect(
  null,
  mapDispatchToProps,
)(Toast);
