# Library-Web

## Infra Structure

![Infra](/docs/images/infra.png)

## Requirements

- `nodejs`: v10 이상
  - `make docker-up` 커맨드를 사용해서 개발할땐 버전 상관없음
  - 도커가 아닌 로컬에서 `yarn build && yarn export` 실행시 `nodejs` 10이상 사용해야함
  - 8버전에서 빌드시 regex에 있는 group name때문에 빌드가 안된다.

## Installation

```
make yarn-install
```

## Run Development

```
make docker-up
```
