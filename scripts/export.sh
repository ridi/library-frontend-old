#!/bin/bash
set -e

yarn install
yarn run build
yarn run export
