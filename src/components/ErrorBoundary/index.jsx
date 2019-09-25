import * as Sentry from '@sentry/browser';
import React from 'react';
import { PageLoadError } from '../Error';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(error);
    Sentry.withScope(scope => {
      scope.setExtra('componentsError', info);
      Sentry.captureException(error);
    });
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
