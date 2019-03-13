#!/bin/bash
set -e

aws s3 sync ./out $S3_PATH --cache-control max-age=31536000,s-maxage=31536000 --exclude "index.html"
aws s3 sync ./out $INDEX_S3_PATH --cache-control max-age=0,no-cache,no-store,must-revalidate --exclude "*" --include "index.html"
