import * as Sentry from '@sentry/react-native';

export const sentryErrorHandler = (error, pushToSentry = true) => {
  if (pushToSentry) {
    Sentry.captureException(error);
  }
};
