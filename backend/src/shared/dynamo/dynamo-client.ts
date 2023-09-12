import {
    DeleteCommand,
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DeleteTableCommand, DescribeTableCommand, KeySchemaElement, KeyType, ListTablesCommand, TableDescription } from '@aws-sdk/client-dynamodb';

export type DynamoItem = Record<string, unknown>;

export type DynamoTableDescription = {
    primaryKeys: string[];
    status: string;
    sizeInBytes: number;
}

export class DynamoClient {
    constructor(
        private readonly dynamoDBDocumentClient: DynamoDBDocumentClient
    ) { }

    async getTablesName(): Promise<string[]> {
        const tables = await this.dynamoDBDocumentClient.send(
            new ListTablesCommand({})
        )

        if (!tables.TableNames) {
            return [];
        }

        return tables.TableNames;
    }

    async describeTable(tableName: string): Promise<DynamoTableDescription> {
        const describeTable = await this.dynamoDBDocumentClient.send(new DescribeTableCommand({
            TableName: tableName
        }));

        if (!describeTable.Table) {
            throw new Error('Table is required');
        }

        if (!describeTable.Table.TableStatus) {
            throw new Error('Table.TableStatus is required');
        }

        if (!describeTable.Table.TableSizeBytes) {
            throw new Error('Table.TableSizeBytes is required');
        }

        return {
            primaryKeys: await this.getPrimaryKeys(describeTable.Table),
            status: describeTable.Table?.TableStatus,
            sizeInBytes: describeTable.Table?.TableSizeBytes
        };
    }

    async deleteTable(tableName: string): Promise<void> {
        this.dynamoDBDocumentClient.send(new DeleteTableCommand({ TableName: tableName }));
    }

    async findOne(
        tableName: string,
        conditions?: { [key: string]: string | number | boolean | null }
    ): Promise<DynamoItem | undefined> {
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
    ): Promise<DynamoItem[]> {
        const keyConditions = this.conditionsToScanFilter(conditions);

        const results = await this.dynamoDBDocumentClient.send(
            new ScanCommand({
                TableName: tableName,
                ScanFilter: keyConditions,
                Limit: limit
            })
        );

        return results.Items ?? [];
    }

    async save(tableName: string, item: DynamoItem): Promise<void> {
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

    private async getPrimaryKeys(tableDescription: TableDescription): Promise<string[]> {
        const primaryKeysKeySchema = tableDescription.KeySchema?.filter((keySchema: KeySchemaElement) => {
            return keySchema.KeyType === KeyType.HASH;
        })

        if (!primaryKeysKeySchema) {
            return [];
        }

        const primaryKeys: string[] = [];

        for (const keySchema of primaryKeysKeySchema) {
            if (keySchema.AttributeName !== undefined) {
                primaryKeys.push(keySchema.AttributeName);
            }
        }

        return primaryKeys;
    }
}
