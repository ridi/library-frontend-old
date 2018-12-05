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

if [ "$ENVIRONMENT" = staging ]; then
run_and_check_exit_code "ecs-cli compose --cluster library-cluster --project-name library-web -f docs/docker/compose/web.yml service up"
else
run_and_check_exit_code "ecs-cli compose --cluster library-staging-cluster --project-name library-staging-web -f docs/docker/compose/web.yml service up"
fi


if [ $? -ne 0 ]; then
    echo "deploy fails"
    exit 1
fi


curl -X POST --data-urlencode "payload={\"text\": \"[내서재 웹][$ENVIRONMENT - $TAG] 배포가 완료되었습니다.\nRepo: https://gitlab.com/ridicorp/account/library-web\"}" $SLACK_DEPLOY_HOOK
