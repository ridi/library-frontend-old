import React from 'react';
import { InternalError, NotFoundError } from '../components/Error';

const NotFound = 404;

export default class Error extends React.Component {
  static displayName = 'ErrorPage';

  static getInitialProps({ res, err }) {
    let errorCode = NotFound;
    if (res && res.statusCode) {
      errorCode = res.statusCode;
    } else if (err && err.statusCode) {
      errorCode = err.statusCode;
    }

    return { errorCode };
  }

  handleClickHistoryBack = () => {
    window.history.back();
  };

  render() {
    const { errorCode } = this.props;

    if (errorCode === NotFound) {
      return <NotFoundError onClickHistoryBack={this.handleClickHistoryBack} />;
    }

    return <InternalError onClickHistoryBack={this.handleClickHistoryBack} />;
  }
}
