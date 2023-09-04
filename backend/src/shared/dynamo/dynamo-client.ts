import {
    DeleteCommand,
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';

import { DynamoMigration } from './dynamo-migration';

export type DynamoClientItem = Record<string, unknown>;

export class DynamoClient {
    constructor(
        private readonly dynamoMigration: DynamoMigration,
        private readonly dynamoDBDocumentClient: DynamoDBDocumentClient
    ) { }

    async getTables(): Promise<string[]> {
        return this.dynamoMigration.listTables();
    }

    async deleteTable(tableName: string): Promise<void> {
        this.dynamoMigration.deleteTable(tableName);
    }

    async findOne(
        tableName: string,
        conditions?: { [key: string]: string | number | boolean | null }
    ): Promise<DynamoClientItem | undefined> {
        this.createTableWhenNotExists(tableName);

        const keyConditions = this.conditionsToScanFilter(conditions);

        const results = await this.dynamoDBDocumentClient.send(
            new ScanCommand({
                TableName: tableName,
                ScanFilter: keyConditions,
                Limit: 1
            })
        );

        if (!results.Items || results.Items.length === 0) {
            return undefined;
        }

        return results.Items[0];
    }

    async find(
        tableName: string,
        conditions?: { [key: string]: string | number | boolean | null },
        limit?: number
    ): Promise<DynamoClientItem[]> {
        this.createTableWhenNotExists(tableName);

        const keyConditions = this.conditionsToScanFilter(conditions);

        const results = await this.dynamoDBDocumentClient.send(
            new ScanCommand({
                TableName: tableName,
                ScanFilter: keyConditions,
                Limit: limit
            })
        );

        if (!results.Items) {
            return [];
        }

        return results.Items;
    }

    async save(tableName: string, item: DynamoClientItem): Promise<void> {
        this.createTableWhenNotExists(tableName);

        await this.dynamoDBDocumentClient.send(
            new PutCommand({
                TableName: tableName,
                Item: item,
            })
        );
    }

    async delete(tableName: string, key: Record<string, unknown>): Promise<void> {
        this.createTableWhenNotExists(tableName);

        await this.dynamoDBDocumentClient.send(
            new DeleteCommand({
                TableName: tableName,
                Key: key
            })
        );
    }

    private conditionsToScanFilter(conditions: { [key: string]: string | number | boolean | null } | undefined): Record<string, any> | undefined {
        if (conditions === undefined) {
            return undefined;
        }

        return Object.keys(conditions).reduce(
            (
                result: {
                    [key: string]: {
                        ComparisonOperator: string;
                        AttributeValueList: any[];
                    };
                },
                property
            ) => {
                result[property] = {
                    ComparisonOperator: 'EQ',
                    AttributeValueList: [conditions[property]],
                };
                return result;
            },
            {}
        );
    }


  private async createTableWhenNotExists(tableName: string): Promise<void> {
    const existsTable = await this.dynamoMigration.existsTable(tableName);

    if (!existsTable) {
      await this.dynamoMigration.createTable(tableName);
    }
  }
}
