#!/bin/bash
set -e

if [ "$ENVIRONMENT" != 'development' ]; then
  SENTRY_RELEASE_VERSION="${SENTRY_PROJECT}-${ENVIRONMENT}-${TAG}"
  PREFIX="~$(node -p "new (require('url').URL)('${S3_PATH}').pathname")"
  echo "Prefix is: $PREFIX"

  yarn sentry-cli releases new $SENTRY_RELEASE_VERSION
  yarn sentry-cli releases files $SENTRY_RELEASE_VERSION upload-sourcemaps \
    --url-prefix $PREFIX \
    --no-rewrite \
    --validate \
    ./out

  find ./out -name '*.map' -and -type f | xargs rm
fi

aws s3 sync ./out $S3_PATH --cache-control max-age=31536000,s-maxage=31536000 --exclude "index.html"
aws s3 sync ./out $INDEX_S3_PATH --cache-control max-age=0,no-cache,no-store,must-revalidate --exclude "*" --include "index.html"

if [ "$ENVIRONMENT" != 'development' ]; then
  yarn sentry-cli releases finalize $SENTRY_RELEASE_VERSION
fi
