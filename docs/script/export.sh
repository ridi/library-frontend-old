#!/bin/bash
set -e

yarn install
NODE_ENV=$ENVIRONMENT yarn run build
NODE_ENV=$ENVIRONMENT yarn run export