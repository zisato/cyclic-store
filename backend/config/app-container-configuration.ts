import {
    AwilixContainer,
    InjectionModeType,
    LifetimeType,
    aliasTo,
    asClass,
    asValue,
} from 'awilix';

import { ContainerConfiguration } from '../src/shared/kernel/configuration/container-configuration';
import { DynamoClient } from '../src/shared/dynamo/dynamo-client';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoMigration } from '../src/shared/dynamo/dynamo-migration';
import { InvalidArgumentError } from '../src/domain/error/invalid-argument-error';
import { ModelNotFoundError } from '../src/domain/error/model-not-found-error';
import { Parameters } from '../src/shared/kernel/parameters/parameters';
import { ProviderIdFromTokenResolver } from '../src/domain/user/service/provider-id-from-token-resolver';
import { UserNotAuthenticatedError } from '../src/infrastructure/error/user-not-authenticated-error';
import { UserNotAuthorizedError } from '../src/infrastructure/error/user-not-authorized-error';

export class AppContainerConfiguration implements ContainerConfiguration {
    configureContainer(container: AwilixContainer, parameters: Parameters): void {
        container.options.injectionMode = parameters.get<InjectionModeType>(
            'container.injectionMode'
        );
        container.loadModules(
            parameters.get<string[]>('container.loadModules.patterns'),
            {
                formatName: 'camelCase',
                resolverOptions: {
                    lifetime: parameters.get<LifetimeType>(
                        'container.loadModules.lifetime'
                    ),
                    injectionMode: parameters.get<InjectionModeType>(
                        'container.loadModules.injectionMode'
                    )
                }
            }
        );

        // TODO: check if can be moved to last
        this.registerAlias(container);

        this.registerArguments(container, parameters);

        this.registerInfrastructureServices(container, parameters);

        this.registerDomainServices(container);

        this.registerTestContainer(container, parameters);
    }

    private registerAlias(container: AwilixContainer): void {
        container.register({
            categoryRepository: aliasTo('inMemoryCategoryRepository'),
            orderRepository: aliasTo('inMemoryOrderRepository'),
            productRepository: aliasTo('inMemoryProductRepository'),
            storeRepository: aliasTo('inMemoryStoreRepository'),
            userRepository: aliasTo('inMemoryUserRepository'),
            // userRepository: aliasTo('dynamoUserRepository'),
        })
    }

    private registerArguments(container: AwilixContainer, parameters: Parameters): void {
        container.register({
            publicPath: asValue(parameters.get<string>('publicPath')),
            errorHandlerMapping: asValue(new Map<string, number>([
                [InvalidArgumentError.name, 400],
                [ModelNotFoundError.name, 404],
                [UserNotAuthenticatedError.name, 401],
                [UserNotAuthorizedError.name, 401]
            ])),
            providerIdsFromToken: asValue([
                container.resolve('plainProviderIdInToken')
            ])
        });
    }

    private registerInfrastructureServices(container: AwilixContainer, parameters: Parameters): void {
        const dynamoDBClient = new DynamoDBClient({
            endpoint: parameters.get<string>('aws.dynamodb.endpoint'),
        });

        container.register({
            dynamoDBClient: asValue(dynamoDBClient),
            dynamoDBDocumentClient: asValue(DynamoDBDocumentClient.from(
                dynamoDBClient
            )),
            dynamoMigration: asClass(DynamoMigration),
            dynamoClient: asClass(DynamoClient),
        });
    }

    private registerDomainServices(container: AwilixContainer): void {
        container.register('providerIdFromTokenResolver', asClass(ProviderIdFromTokenResolver));
    }

    private registerTestContainer(container: AwilixContainer, parameters: Parameters): void {
        const isTestEnvironment = parameters.get<string>('environment') === 'test';

        if (isTestEnvironment) {
            container.register('providerIdsFromToken', asValue([
                container.resolve('plainProviderIdInToken')
            ]))
        }
    }
}
