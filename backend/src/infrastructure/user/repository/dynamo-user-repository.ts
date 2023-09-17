import { DynamoClient, DynamoItem } from '../../../shared/dynamo/dynamo-client';

import { ModelNotFoundError } from '../../../domain/error/model-not-found-error';
import { TableSchema } from '../../../shared/dynamo/dynamo-migration';
import { User } from '../../../domain/user/user';
import { UserRepository } from '../../../domain/user/repository/user-repository';

export class DynamoUserRepository implements UserRepository {
    constructor(private readonly dynamoClient: DynamoClient) {}

    static tableName(): string {
        return 'user'
    }

    static tableSchema(): TableSchema {
        return {
            AttributeDefinitions: [
                {
                    AttributeName: 'id',
                    AttributeType: 'S',
                },
            ],
            KeySchema: [
                {
                    AttributeName: 'id',
                    KeyType: 'HASH',
                },
            ],
        }
    }

    async exists(id: string): Promise<boolean> {
        const item = await this.dynamoClient.findOne(DynamoUserRepository.tableName(), { id });

        return item !== undefined;
    }

    async existsByProviderId(providerId: string): Promise<boolean> {
        const item = await this.dynamoClient.findOne(DynamoUserRepository.tableName(), { providerId });

        return item !== undefined;
    }

    async get(id: string): Promise<User> {
        const item = await this.dynamoClient.findOne(DynamoUserRepository.tableName(), { id });

        if (item === undefined) {
            throw new ModelNotFoundError(`User with id ${id} not found`);
        }

        return this.itemToModel(item);
    }

    async getByProviderId(providerId: string): Promise<User> {
        const item = await this.dynamoClient.findOne(DynamoUserRepository.tableName(), { providerId });

        if (item === undefined) {
            throw new ModelNotFoundError(`User with providerId ${providerId} not found`);
        }

        return this.itemToModel(item);
    }

    async save(user: User): Promise<void> {
        this.dynamoClient.save(DynamoUserRepository.tableName(), this.modelToItem(user));
    }

    private itemToModel(item: DynamoItem): User {
        if (typeof item.id !== 'string') {
            throw new Error('Invalid id type')
        }

        if (typeof item.providerId !== 'string') {
            throw new Error('Invalid providerId type')
        }

        if (!Array.isArray(item.roles)) {
            throw new Error('Invalid roles type')
        }

        return new User({ id: item.id, providerId: item.providerId, roles: item.roles });
    }

    private modelToItem(user: User): DynamoItem {
        return {
            id: user.id,
            providerId: user.providerId,
            roles: user.roles,
        }
    }
}
