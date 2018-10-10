#!/bin/bash
set -e

run_and_check_exit_code() {
    pids=""
    for command in "$@"; do
        eval $command &
        pids="$pids $!"
    done

    for p in $pids; do
        if wait $p; then
            echo "success"
        else
            echo "failure"
            exit 1
        fi
    done
}

run_and_check_exit_code "ecs-cli compose --cluster library-cluster --project-name library-web -f docs/docker/compose/web.yml service up"

if [ $? -ne 0 ]; then
    echo "deploy fails"
    exit 1
fi


curl -X POST --data-urlencode "payload={\"text\": \"[$ENVIRONMENT - $TAG] 내 서재 배포가 완료되었습니다!!!!!!!\nRepo: https://gitlab.ridi.io/account/library\"}" $SLACK_DEPLOY_HOOK
