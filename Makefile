.PHONY: help docker-all

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

docker-all:
	@echo "Docker 대신 traefik/library.toml을 사용해 주세요.\n자세한 내용은 README.md를 확인하세요."


# docker
docker-static-up:
	@docker-compose -f docker-compose-static.yml up
