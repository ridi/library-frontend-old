import React from 'react';
import { connect } from 'react-redux';

import { getToast } from '../services/toast/selectors';

const Toast = ({ toast }) => {
  if (toast === null) {
    return null;
  }

  return <React.Fragment>{toast.message}</React.Fragment>;
};

const mapStateToProps = state => ({
  toast: getToast(state),
});
export default connect(mapStateToProps)(Toast);
