import { FastifyPluginAsync, FastifyPluginCallback } from 'fastify';
import { Container } from '../../container/container';
import { Parameters } from '../../parameters/parameters';

export interface PluginConfigurationCallback {
  options: object
  callback: FastifyPluginAsync | FastifyPluginCallback
}

export interface PluginConfiguration {
  getPluginsConfiguration(
    container: Container,
    parameters: Parameters
  ): PluginConfigurationCallback[];
}
