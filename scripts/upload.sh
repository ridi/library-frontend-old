#!/bin/bash
set -e

aws s3 sync ./out $S3_PATH
