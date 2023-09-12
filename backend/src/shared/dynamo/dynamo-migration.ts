import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  ListTablesCommand,
} from '@aws-sdk/client-dynamodb';

export type DynamoClientItem = Record<string, unknown>;

export type TableSchema = {
  AttributeDefinitions: {
    AttributeName: string;
    AttributeType: 'B' | 'N' | 'S';
  }[];
  KeySchema: {
    AttributeName: string;
    KeyType: 'HASH' | 'RANGE';
  }[],
}

export class DynamoMigration {
  constructor(private readonly dynamoDBClient: DynamoDBClient) { }

  async deleteTable(tableName: string): Promise<void> {
    this.dynamoDBClient.send(new DeleteTableCommand({ TableName: tableName }));
  }

  async listTables(): Promise<string[]> {
    const tables = await this.dynamoDBClient.send(new ListTablesCommand({}));
    if (!tables.TableNames) {
      return [];
    }

    return tables.TableNames;
  }

  async createTable(tableName: string, tableSchema: TableSchema): Promise<void> {
    const existsTable = await this.existsTable(tableName);

    if (existsTable) {
      return;
    }

    await this.dynamoDBClient.send(
      new CreateTableCommand({
        TableName: tableName,
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
        ...tableSchema
      })
    );
  }

  async existsTable(tableName: string): Promise<boolean> {
    const tables = await this.dynamoDBClient.send(new ListTablesCommand({}));
    if (!tables.TableNames) {
      return false;
    }

    return tables.TableNames.some((table) => {
      return table === tableName;
    });
  }
}
