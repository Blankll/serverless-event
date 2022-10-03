#!/bin/bash -eux
set -o pipefail

cd "$(dirname "$0")/.." || exit

mkdir -p "artifacts"
rm -rf ./dist ./artifacts/*

IMAGE_NAME="serverless-event"
docker build -t "${IMAGE_NAME}" .

docker run --rm \
 -v "$(pwd)"/dist:/dist \
 --name "${IMAGE_NAME}-package" "${IMAGE_NAME}:latest" \
 sh -c "cp -r /app/. /dist" 

cd dist && zip -r -D "../artifacts/${IMAGE_NAME}.zip" ./*
