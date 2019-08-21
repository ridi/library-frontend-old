# Library-Web

## Requirements

- `nodejs`: v10 이상

## Installation

```
yarn install
```

## Run Development

### Docker 없이 실행하는 방법

1. 프론트엔드 `traefik` 리포지토리 안에 있는 `traefik` 디렉토리에 이
   리포지토리의 `traefik/library.toml`을 복사해 넣습니다.
1. `yarn local`으로 개발 서버를 실행합니다.

### Docker를 사용해 실행하는 방법

`docker-compose`를 사용합니다.

```sh
docker-compose up
```
