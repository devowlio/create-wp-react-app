#!/bin/sh

# Builds the docker file ../docker/ci-e2e/Dockerfile with the correct version.

if [ -z "$VERSION" ]; then
    VERSION=$(node -e "console.log(require('./package.json').version)")
fi

CONTAINER_NAME=$(node -e "console.log(require('./package.json')['docker-ci-e2e-image-name'] || '')")

echo "docker build --cache-from \"$CONTAINER_NAME:latest\" -t \"$CONTAINER_NAME:$VERSION\" \"$@\" ./devops/docker/ci-e2e"
docker build --cache-from "$CONTAINER_NAME:latest" -t "$CONTAINER_NAME:$VERSION" "$@" ./devops/docker/ci-e2e