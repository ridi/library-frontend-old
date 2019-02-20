.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

docker-all: yarn-install run-local


# install
yarn-install:
	@yarn global add pm2 && yarn install


# run
run-local:
	NODE_ENV=local yarn dev

local:
	NODE_ENV=local yarn build
	NODE_ENV=local yarn export

# docker
docker-up:
	@docker-compose up

docker-logs:
	@docker ps -a -q -f name=library-web | awk '{print $1}' | xargs docker logs -f

docker-web:
	@docker-compose up library-web
