import { Container } from '../../src/shared/kernel/container/container';
import { RouteConfiguration } from '../../src/shared/kernel/configuration/fastify/router-configuration';
import { RouteOptions } from 'fastify';
import IndexController from '../../src/infrastructure/controller/index-controller';
import StatusController from '../../src/infrastructure/controller/status-controller';

export class AppRouteConfiguration implements RouteConfiguration {
  getRoutesOption(container: Container): RouteOptions[] {
    const commonRoutesOptions = this.commonRoutesOptions(container);

    return [
      ...commonRoutesOptions
    ];
  }

  private commonRoutesOptions(container: Container): RouteOptions[] {
    const indexController = container.getTyped(IndexController);
    const statusController = container.getTyped(StatusController);

    const indexRoute: RouteOptions = {
      method: 'GET',
      url: '/',
      handler: indexController.handle.bind(indexController)
    }

    const statusRoute: RouteOptions = {
      method: 'GET',
      url: '/status',
      handler: statusController.handle.bind(statusController)
    }

    return [
      indexRoute,
      statusRoute
    ];
  }
}