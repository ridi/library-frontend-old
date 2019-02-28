#!/bin/bash
set -e


curl -X POST --data-urlencode "payload={\"text\": \"[웹 내 서재][$ENVIRONMENT - $TAG] 배포가 완료되었습니다.\nRepo: https://gitlab.com/ridicorp/account/library-web\"}" $SLACK_DEPLOY_HOOK
