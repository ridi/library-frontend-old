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

run_and_check_exit_code "ecs-cli compose --cluster library-render-cluster --project-name library-renderer -f docs/compose/web.yml service up"

if [ $? -ne 0 ]; then
    echo "deploy fails"
    exit 1
fi


curl -X POST --data-urlencode "payload={\"text\": \"[$ENVIRONMENT - $TAG] 구매목록 SSR서버 배포가 완료되었습니다!!!!!!!\nRepo: https://gitlab.ridi.io/account/library-render\"}" $SLACK_DEPLOY_HOOK
