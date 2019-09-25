import * as Sentry from '@sentry/browser';
import React from 'react';
import { PageLoadError } from '../Error';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    Sentry.withScope(scope => {
      scope.setExtra('componentsError', info);
      Sentry.captureException(error);
    });
    console.error(error);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <PageLoadError />;
    }

    return children;
  }
}
