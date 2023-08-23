import { Server } from 'http';
import { Container } from '../../container/container';
import { Parameters } from '../../parameters/parameters';
import { PluginConfiguration, PluginConfigurationCallback } from './plugin-configuration';
import { RouteConfiguration } from './router-configuration';
import { ErrorHandler, ErrorHandlerConfiguration } from './error-handler-configuration';
import { FrameworkAdapter } from '../framework-adapter';
import fastify, { FastifyInstance, RouteOptions } from 'fastify';
import { HookConfiguration, HookHandler } from './hook-configuration';

export class FastifyFrameworkAdapter implements FrameworkAdapter {
    private hookConfiguration: HookConfiguration;
    private pluginConfiguration: PluginConfiguration;
    private routerConfiguration: RouteConfiguration;
    private errorHandlerConfiguration: ErrorHandlerConfiguration;

    private isBooted: boolean = false;
    private fastify: FastifyInstance | null = null;
    private server: Server | null = null;
  
    constructor({
      hookConfiguration,
      pluginConfiguration,
      routerConfiguration,
      errorHandlerConfiguration
    }: {
      hookConfiguration?: HookConfiguration;
      pluginConfiguration?: PluginConfiguration;
      routerConfiguration?: RouteConfiguration;
      errorHandlerConfiguration?: ErrorHandlerConfiguration;
    }) {
      this.hookConfiguration = hookConfiguration ?? {
        getHooksConfiguration(
          _container: Container,
          _parameters: Parameters
        ): HookHandler[] {
          return [];
        },
      };
      this.pluginConfiguration = pluginConfiguration ?? {
        getPluginsConfiguration(
          _container: Container,
          _parameters: Parameters
        ): PluginConfigurationCallback[] {
          return [];
        },
      };
      this.routerConfiguration = routerConfiguration ?? {
        getRoutesOption(_container: Container): RouteOptions[] {
          return [];
        },
      };
      this.errorHandlerConfiguration = errorHandlerConfiguration ?? {
        getErrorHandlerConfiguration(
          _container: Container
        ): ErrorHandler | undefined {
          return undefined;
        },
      };
    }
  
    boot(container: Container, parameters: Parameters): void {
      if (!this.isBooted) {
        const app = fastify();
  
        this.loadHooks(app,container, parameters);
        this.loadPlugins(app, container, parameters);
        this.loadRoutes(app, container);
        this.loadErrorHandler(app, container, parameters);
  
        this.fastify = app;
        this.isBooted = true;
      }
    }

    async startServer(port: number, host?: string): Promise<Server> {
      if (!this.isBooted) {
        throw new Error('Cannot start server without boot first');
      }
  
      if (this.server !== null) {
        return this.server;
      }
  
      const fastify = this.getFastify();

      try {
        await fastify.listen({ port, host })
      } catch (error) {
        console.log('Error starting server', error);
       
        throw error;
      }

      this.server = fastify.server;

      return this.server;
    }
  
    async shutdown(): Promise<void> {
      if (this.server !== null) {
        this.server.close();
        this.server.closeAllConnections();
      }
      
      this.fastify = null;
      this.isBooted = false;
    }
  
    private loadHooks(
      app: FastifyInstance,
      container: Container,
      parameters: Parameters
    ): void {
      const hooks =
        this.hookConfiguration.getHooksConfiguration(
          container,
          parameters
        );

        hooks.forEach((hook) => app.addHook(hook.name as any, hook.callback));
    }

    private loadPlugins(
      app: FastifyInstance,
      container: Container,
      parameters: Parameters
    ): void {
      const plugins =
        this.pluginConfiguration.getPluginsConfiguration(
          container,
          parameters
        );

        plugins.forEach((plugin) => app.register(plugin.callback, plugin.options));
    }
  
    private loadRoutes(app: FastifyInstance, container: Container): void {
      const routers = this.routerConfiguration.getRoutesOption(container);

      routers.forEach((router) => app.route(router));
    }
  
    private loadErrorHandler(
      app: FastifyInstance,
      container: Container,
      parameters: Parameters
    ): void {
      const errorHandler =
        this.errorHandlerConfiguration.getErrorHandlerConfiguration(
          container,
          parameters
        );

      if (errorHandler) {
        app.setErrorHandler(errorHandler);
      }
    }
  
    private getFastify(): FastifyInstance {
      if (this.fastify === null) {
        throw new Error(
          'Cannot get fastify from non server started kernel'
        );
      }
  
      return this.fastify;
    }
  }