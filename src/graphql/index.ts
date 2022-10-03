import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer, gql } from 'apollo-server-lambda';
import { DynamoDBClient, HttpClient, loadDynamoDBClient, loadHttpClient } from '../datasource';
import newRelicPlugin from '@newrelic/apollo-server-plugin';
import { Resolvers } from '../generated/resolverTypes';

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

const dataSources = (): DataSources => ({
  dynamoDB: loadDynamoDBClient(),
  httpApi: loadHttpClient('https://www.google.com'),
});

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    dbCall: async (parent: any, input: any, { dataSources }: { dataSources: DataSources }) => {
      console.log({ parent, input }, 'input-dbCall');
      return JSON.stringify(await dataSources.dynamoDB.getItem(input.id));
    },
    simulate: {
      http: async (_: any, __: any, { dataSources }: { dataSources: DataSources }) =>
        dataSources.httpApi.get(''),
      dynamo: {
        partiQL: async (
          parent: any,
          { id }: { id: string },
          { dataSources }: { dataSources: DataSources }
        ) => {
          console.log({ parent, id }, 'input-obj');
          return JSON.stringify(
            await dataSources.dynamoDB.query(
              `SELECT * FROM serverless-event-table WHERE id='${id}'`
            )
          );
        },
        getItem: async (
          _: any,
          { id }: { id: string },
          { dataSources }: { dataSources: DataSources }
        ) => JSON.stringify(await dataSources.dynamoDB.getItem(id)),
      },
    },
  },
};

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: dataSources as any,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground(), newRelicPlugin],
});
