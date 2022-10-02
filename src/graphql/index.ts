import { readdir } from 'fs/promises';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer, gql } from 'apollo-server-lambda';

const typeDefs = gql`
  type Query {
    hello: String
    getDir(path: String!): String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    getDir: async (_: any, { path }: { path: string }) => JSON.stringify(await readdir(path)),
  },
};

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});
