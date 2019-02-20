#!/bin/bash
set -e

aws s3 sync ./out $S3_PATH --cache-control max-age=31536000,s-maxage=31536000
