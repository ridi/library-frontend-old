#!/bin/bash
set -e

yarn install
yarn run build
yarn run export
aws s3 sync ./out $S3_PATH
