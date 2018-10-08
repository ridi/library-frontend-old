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

# push image
run_and_check_exit_code "ecs-cli push $ENVIRONMENT/library_web/www:$TAG"
run_and_check_exit_code "ecs-cli push $ENVIRONMENT/library_web/nginx:$TAG"

if [ $? -ne 0 ]; then
    echo "push fails"
    exit 1
fi
