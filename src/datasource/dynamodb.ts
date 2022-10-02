import { DynamoDBClient as Client } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ExecuteStatementCommand } from '@aws-sdk/lib-dynamodb';

export type DynamoDBItem = {
  [key in any]: any;
};
export interface DynamoDBClient {
  query: (sqlStr: string) => Promise<Array<DynamoDBItem>>;
  getItem: (id: string) => Promise<DynamoDBItem>;
}

const client = DynamoDBDocumentClient.from(new Client({}));

export const loadDynamoDBClient = (): DynamoDBClient => ({
  query: async (sqlStr: string) => {
    try {
      const { Items: items } = await client.send(
        new ExecuteStatementCommand({ Statement: sqlStr })
      );
      return items as Array<DynamoDBItem>;
    } catch (err) {
      console.error(err, 'failed request dynamodb');
      throw err;
    }
  },
  getItem: async (id: string) => {
    try {
      const { Item: item } = await client.send(
        new GetCommand({
          TableName: 'serverless-event-table',
          Key: { id },
        })
      );
      return item as DynamoDBItem;
    } catch (err) {
      console.error(err, 'failed request dynamodb');
      throw err;
    }
  },
});
