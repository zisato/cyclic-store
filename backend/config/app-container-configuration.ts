import {
    AwilixContainer,
    InjectionModeType,
    LifetimeType,
    aliasTo,
    asValue,
} from 'awilix';

import { ContainerConfiguration } from '../src/shared/kernel/configuration/container-configuration';
import { Parameters } from '../src/shared/kernel/parameters/parameters';
import { InvalidArgumentError } from '../src/domain/error/invalid-argument-error';

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

        container.register({
            publicPath: asValue(parameters.get<string>('publicPath')),
            errorHandlerMapping: asValue(new Map<string, number>([
                [InvalidArgumentError.name, 400],
              ])),
        });

        this.registerAlias(container);
    }

    private registerAlias(container: AwilixContainer): void {
        container.register({
            categoryRepository: aliasTo('inMemoryCategoryRepository')
        })
    }
}
