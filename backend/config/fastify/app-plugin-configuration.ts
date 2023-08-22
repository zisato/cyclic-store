import { Container } from '../../src/shared/kernel/container/container';
import { PluginConfiguration, PluginConfigurationCallback } from '../../src/shared/kernel/configuration/fastify/plugin-configuration';
import { Parameters } from '../../src/shared/kernel/parameters/parameters';
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static';

export class AppPluginConfiguration implements PluginConfiguration {
  getPluginsConfiguration(
    _container: Container,
    parameters: Parameters
  ): PluginConfigurationCallback[] {
    return [
      {
        options: {
          origin: '*'
        },
        callback: cors
      },
      {
        options: {
          root: parameters.get<string>('publicPath')
        },
        callback: fastifyStatic as any
      }
    ];
  }
}
