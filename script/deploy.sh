#!/bin/bash -eux
set -o pipefail

cd "$(dirname "$0")/.." || exit
PROFILE=$1

APP_NAME="serverless-event"

#  deploy stack
aws --profile "${PROFILE}" \
    cloudformation deploy \
    --stack-name $APP_NAME \
    --parameter-overrides AppName="${APP_NAME}" \
    --template-file ./deploy/cloudformation.yml \
    --capabilities CAPABILITY_IAM

# upload source code
aws --profile "${PROFILE}" \
    lambda update-function-code \
    --function-name "${APP_NAME}-lambda" \
    --zip-file "fileb://artifacts/${APP_NAME}.zip"
