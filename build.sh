#!/bin/bash

set -e

init() {
  me=`id -u`:`id -g`
  echo "DEFAULT_DOCKER_USER=$me" > .env
}

image() {
  name=$(grep '"name"' package.json | awk -F'"' '{print $4}')
  version=$(grep '"version"' package.json | awk -F'"' '{print $4}')
  TAG="docker/repository/sre-docker-hosted/${name}:${version}"
  ARCHITECTURE="linux/arm64,linux/amd64"
  #ARCHITECTURE="linux/amd64"
  #docker buildx build -t "$TAG" . -f Dockerfile --build-arg LAUNCHER_VERSION="$LAUNCHER_VERSION" --platform $ARCHITECTURE --load --push
  docker buildx build  -t maven.opendigitaleducation.com/${TAG} . --platform $ARCHITECTURE -f Dockerfile --push
}

init

image