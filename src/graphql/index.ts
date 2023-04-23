import { DynamoDBClient, HttpClient } from '../datasource';
import createNewRelicPlugin from '@newrelic/apollo-server-plugin';
import { Resolvers } from '../generated/resolverTypes';
import gql from 'graphql-tag';
import { ApolloServer, ApolloServerPlugin } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginUsageReporting } from '@apollo/server/plugin/usageReporting';

const typeDefs = gql`
  type Http {
    status: Int
    message: String
    body: String
  }
  type Dynamo {
    partiQL(id: String!): String
    getItem(id: String!): String
  }
  type Simulate {
    http: Http
    dynamo: Dynamo
  }
  type Query {
    hello: String
    dbCall(id: String!): String
    simulate: Simulate
  }
`;

type DataSources = {
  dynamoDB: DynamoDBClient;
  httpApi: HttpClient;
};

const resolvers: Resolvers<{ dataSources: DataSources }> = {
  Query: {
    hello: () => 'Hello world!',
    dbCall: async (parent, input, { dataSources }) => {
      console.log({ parent, input }, 'input-dbCall');
      return JSON.stringify(await dataSources.dynamoDB.getItem(input.id));
    },
    simulate: () => ({}),
  },
  Simulate: {
    http: async (_, __, { dataSources }) => dataSources.httpApi.get(''),
    dynamo: () => ({}),
  },
  Dynamo: {
    partiQL: async (parent, { id }, { dataSources }) => {
      console.log({ parent, id }, 'input-obj');
      return JSON.stringify(
        await dataSources.dynamoDB.query(`SELECT *
                                          FROM "serverless-event-table"
                                          WHERE id = '${id}'`)
      );
    },
    getItem: async (_, { id }, { dataSources }) =>
      JSON.stringify(await dataSources.dynamoDB.getItem(id)),
  },
};

export const graphqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageLocalDefault(),
    ...((appEnv) =>
      appEnv === 'prod'
        ? [
            createNewRelicPlugin<ApolloServerPlugin>({}),
            ApolloServerPluginUsageReporting({
              sendHeaders: { all: true },
              sendVariableValues: { all: true },
            }),
          ]
        : [])(process.env.APP_ENV),
  ],
  introspection: true,
});
