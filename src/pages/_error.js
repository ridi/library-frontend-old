import React from 'react';
import { InternalError, NotFoundError } from '../components/Error';
import HorizontalRuler from '../components/HorizontalRuler';
import { notifySentry } from '../utils/sentry';

const Internal = 500;
const NotFound = 404;

export default class Error extends React.Component {
  static displayName = 'ErrorPage';

  static getInitialProps({ res, err }) {
    let errorCode = Internal;
    if (res && res.statusCode) {
      errorCode = res.statusCode;
    } else if (err && err.statusCode) {
      errorCode = err.statusCode;
    }

    notifySentry(err);
    return { errorCode };
  }

  onClickHistoryBack = () => {
    window.history.back();
  };

  render() {
    const { errorCode } = this.props;

    return (
      <>
        <HorizontalRuler color="#d1d5d9" />
        {errorCode === NotFound ? (
          <NotFoundError onClickHistoryBack={this.onClickHistoryBack} />
        ) : (
          <InternalError onClickHistoryBack={this.onClickHistoryBack} />
        )}
      </>
    );
  }
}
