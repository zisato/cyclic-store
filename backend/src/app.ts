import { AppContainerConfiguration } from '../config/app-container-configuration';
import { AppErrorHandlerConfiguration } from '../config/fastify/app-error-handler-configuration';
import { AppHookConfiguration } from '../config/fastify/app-hook-configuration';
import { AppPluginConfiguration } from '../config/fastify/app-plugin-configuration';
import { AppRouteConfiguration } from '../config/fastify/app-route-configuration';
// import { Container } from './shared/kernel/container/container';
// import { DynamoMigration } from './shared/dynamo/dynamo-migration';
// import { DynamoUserRepository } from './infrastructure/user/repository/dynamo-user-repository';
import { FastifyFrameworkAdapter } from './shared/kernel/configuration/fastify/fastify-framework-adapter';
import { Kernel } from './shared/kernel/kernel';
// import { Parameters } from './shared/kernel/parameters/parameters';
import path from 'path';

export class App extends Kernel {
  constructor() {
    const frameworkAdapter = new FastifyFrameworkAdapter({
      pluginConfiguration: new AppPluginConfiguration(),
      routerConfiguration: new AppRouteConfiguration(),
      errorHandlerConfiguration: new AppErrorHandlerConfiguration(),
      hookConfiguration: new AppHookConfiguration(),
    });
    /*
    const beforeServerStart = async (container: Container, _parameters: Parameters): Promise<void> => {
      const dynamoMigration = container.getTyped(DynamoMigration);

      await dynamoMigration.createTable(DynamoUserRepository.tableName(), DynamoUserRepository.tableSchema());
    }
    */
    
    super({
      containerConfiguration: new AppContainerConfiguration(),
      frameworkAdapter
    });
  }

  rootDir(): string {
      return path.join(__dirname, '..', 'config');
  }
}
