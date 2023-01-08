# serverless-event
An app build on top of node,lambda, apollo-graphql.
It already integrated with newrelic, implemented a simple query to call http and dynamodb

## Prerequisite
- docker
- node 16
- aws-cli v2

## Install
Install all related dependencies:
```bash
npm Install
npm run codegen # optional
npm run lint:fix # optional
```
## package
By runing command bellow to package a executable lambda .zip
```bash
./scripts/package.sh
```
## deploy
The whole stack defined in `deploy/cloudformation.yml` you can build it by upload it to cloudformation or simply run command bellow to sart up:
```sql
./scripts/deploy.sh aws-profile nr-account-id nr-license-key apollo-key apollo-graph-ref
```
## Sample requests
```bash
curl --request POST \
    --header 'content-type: application/json' \
    --url 'https://main--serverless-event.apollographos.net/graphql' \
    --data '{"query":"query ExampleQuery {\n  hello\n}"}'
```
## Simulate Scenarios
By default, the dynamodb permission `dynamodb:PartiQLSelect` is denied, hence Query `simulate.dynamo.partiQL` will failed.

Sample query to simulate dynamodb error:
```bash
curl --request POST \
    --header 'content-type: application/json' \
    --url 'https://2f1959x0mc.execute-api.us-west-1.amazonaws.com/graphql' \
    --data '{"query":"query Query($partiQlId: String!, $getItemId: String!, $dbCallId: String!) {\n  hello\n  simulate {\n    dynamo {\n      partiQL(id: $partiQlId)\n      getItem(id: $getItemId)\n    }\n  }\n  dbCall(id: $dbCallId)\n}","variables":{"partiQlId":"nr-t","getItemId":"nr-t","dbCallId":"nr-t"}}'
```