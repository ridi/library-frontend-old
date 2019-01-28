.PHONY: help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

secret-init: python-package-install settings

docker-all: yarn-install run-local


# install
settings:
	@pipenv run python3.6 -m docs.script.secret_generator -a defaults

ci-settings:
	@pipenv run python3.6 -m docs.script.secret_generator -a parameter_store -e $(ns)

python-package-install:
	@pipenv install --deploy

yarn-install:
	@yarn global add pm2 && yarn install


# run
run-local:
	@yarn run local


# docker
docker-up: python-package-install settings
	@docker-compose up

docker-logs:
	@docker ps -a -q -f name=library-web | awk '{print $1}' | xargs docker logs -f

docker-web: python-package-install settings
	@docker-compose up library-web