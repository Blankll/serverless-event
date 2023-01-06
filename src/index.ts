import { app } from './app';
import { graphqlServer } from './graphql';
import { loadDynamoDBClient, loadHttpClient } from './datasource';
import { json } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { getCurrentInvoke } from '@vendia/serverless-express';
import serverlessExpress from '@vendia/serverless-express';
const dataSources = {
  dynamoDB: loadDynamoDBClient(),
  httpApi: loadHttpClient('https://www.google.com'),
};

graphqlServer.startInBackgroundHandlingStartupErrorsByLoggingAndFailingAllRequests();
app.use(
  '/graphql',
  json(),
  expressMiddleware(graphqlServer, {
    context: async ({ req: express }) => {
      const {
        event: { headers },
      } = getCurrentInvoke();

      return {
        headers,
        express,
        dataSources,
        startDateTime: new Date(),
      };
    },
  })
);

export const handler = serverlessExpress({ app });
