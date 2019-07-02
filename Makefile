.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

docker-all: yarn-install run-local


# install
yarn-install:
	@yarn install


# run
run-local:
	yarn local

build-local:
	yarn build webpack.local.js

# docker
docker-up:
	@docker-compose up

docker-static-up:
	@docker-compose -f docker-compose-static.yml up

docker-logs:
	@docker ps -a -q -f name=library-web | awk '{print $1}' | xargs docker logs -f

docker-web:
	@docker-compose up library-web
