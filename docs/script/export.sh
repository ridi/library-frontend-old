#!/bin/bash
set -e

yarn install

if [ "$ENVIRONMENT" != 'development' ]; then
  export SENTRY_RELEASE_VERSION="${SENTRY_PROJECT}-${ENVIRONMENT}-${TAG}"
fi

NODE_ENV=$ENVIRONMENT yarn run build
NODE_ENV=$ENVIRONMENT yarn run export
