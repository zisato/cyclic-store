import { AppContainerConfiguration } from '../config/app-container-configuration';
import { AppPluginConfiguration } from '../config/fastify/app-plugin-configuration';
import { AppRouteConfiguration } from '../config/fastify/app-route-configuration';
import { AppErrorHandlerConfiguration } from '../config/fastify/app-error-handler-configuration';
import { AppHookConfiguration } from '../config/fastify/app-hook-configuration';
import { FastifyFrameworkAdapter } from './shared/kernel/configuration/fastify/fastify-framework-adapter';
import { Kernel } from './shared/kernel/kernel';

export class App extends Kernel {
  constructor() {
    const frameworkAdapter = new FastifyFrameworkAdapter({
      pluginConfiguration: new AppPluginConfiguration(),
      routerConfiguration: new AppRouteConfiguration(),
      errorHandlerConfiguration: new AppErrorHandlerConfiguration(),
      hookConfiguration: new AppHookConfiguration(),
    });
    
    super({
      containerConfiguration: new AppContainerConfiguration(),
      frameworkAdapter
    });
  }
}
