import {
    AwilixContainer,
    InjectionModeType,
    LifetimeType,
    asValue,
} from 'awilix';

import { ContainerConfiguration } from '../src/shared/kernel/configuration/container-configuration';
import { Parameters } from '../src/shared/kernel/parameters/parameters';

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
                    ),
                },
            }
        );

        container.register({
            publicPath: asValue(parameters.get<string>('publicPath')),
        });
    }
}
