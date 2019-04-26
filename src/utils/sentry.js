import { init, captureMessage, captureException, captureEvent, Severity } from '@sentry/browser';
import config from '../config';

export const initializeSentry = () => {
  init({
    dsn: config.SENTRY_DSN,
    release: config.SENTRY_RELEASE_VERSION || undefined,
  });
};

export const notifySentry = err => {
  if (!err) {
    return;
  }

  captureException(err);
};

export const notifyMessage = msg => {
  captureMessage(msg, Severity.Info);
};

export default {
  captureMessage,
  captureException,
  captureEvent,
};
