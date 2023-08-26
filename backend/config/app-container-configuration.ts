import {
    AwilixContainer,
    InjectionModeType,
    LifetimeType,
    aliasTo,
    asClass,
    asValue,
} from 'awilix';

import { ContainerConfiguration } from '../src/shared/kernel/configuration/container-configuration';
import { InvalidArgumentError } from '../src/domain/error/invalid-argument-error';
import { ModelNotFoundError } from '../src/domain/error/model-not-found-error';
import { Parameters } from '../src/shared/kernel/parameters/parameters';
import { ProviderIdFromTokenResolver } from '../src/domain/user/service/provider-id-from-token-resolver';

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

        this.registerAlias(container);

        container.register({
            publicPath: asValue(parameters.get<string>('publicPath')),
            errorHandlerMapping: asValue(new Map<string, number>([
                [InvalidArgumentError.name, 400],
                [ModelNotFoundError.name, 404]
            ])),
        });

        container.register('providerIdFromTokenResolver', asClass(ProviderIdFromTokenResolver).inject((d) => ({
            providerIdsFromToken: [
                d.resolve('plainProviderIdInToken')
            ]
        })));
    }

    private registerAlias(container: AwilixContainer): void {
        container.register({
            categoryRepository: aliasTo('inMemoryCategoryRepository'),
            userRepository: aliasTo('inMemoryUserRepository'),
        })
    }
}
