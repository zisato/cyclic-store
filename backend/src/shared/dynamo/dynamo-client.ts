import {
    DeleteCommand,
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DeleteTableCommand, ListTablesCommand } from '@aws-sdk/client-dynamodb';

export type DynamoClientItem = Record<string, unknown>;

export class DynamoClient {
    constructor(
        private readonly dynamoDBDocumentClient: DynamoDBDocumentClient
    ) { }

    async getTables(): Promise<string[]> {
        const tables = await this.dynamoDBDocumentClient.send(
            new ListTablesCommand({})
        )

        if (!tables.TableNames) {
            return [];
        }

        return tables.TableNames;
    }

    async deleteTable(tableName: string): Promise<void> {
        this.dynamoDBDocumentClient.send(new DeleteTableCommand({ TableName: tableName }));
    }

    async findOne(
        tableName: string,
        conditions?: { [key: string]: string | number | boolean | null }
    ): Promise<DynamoClientItem | undefined> {
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
        await this.dynamoDBDocumentClient.send(
            new PutCommand({
                TableName: tableName,
                Item: item,
            })
        );
    }

    async delete(tableName: string, key: Record<string, unknown>): Promise<void> {
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
}
