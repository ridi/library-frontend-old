#!/bin/bash
set -e

yarn install
yarn build
yarn export
aws s3 sync ./out $S3_PATH
