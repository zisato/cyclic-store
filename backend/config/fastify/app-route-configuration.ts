import { Container } from '../../src/shared/kernel/container/container';
import { RouteConfiguration } from '../../src/shared/kernel/configuration/fastify/router-configuration';
import { RouteOptions } from 'fastify';
import IndexController from '../../src/infrastructure/controller/index-controller';
import StatusController from '../../src/infrastructure/controller/status-controller';
import CreateCategoryController from '../../src/infrastructure/category/controller/create-category-controller';
import ListCategoriesController from '../../src/infrastructure/category/controller/list-categories-controller';
import UpdateCategoryController from '../../src/infrastructure/category/controller/update-category-controller';

export class AppRouteConfiguration implements RouteConfiguration {
  getRoutesOption(container: Container): RouteOptions[] {
    const commonRoutesOptions = this.commonRoutesOptions(container);
    const categoryRoutesOptions = this.categoryRoutesOptions(container);

    return [
      ...commonRoutesOptions,
      ...categoryRoutesOptions
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

  private categoryRoutesOptions(container: Container): RouteOptions[] {
    const createCategoryController = container.getTyped(CreateCategoryController);
    const updateCategoriesController = container.getTyped(UpdateCategoryController);
    const listCategoriesController = container.getTyped(ListCategoriesController);

    const listRoute: RouteOptions = {
      method: 'GET',
      url: '/admin/categories',
      handler: listCategoriesController.handle.bind(listCategoriesController)
    }

    const createRoute: RouteOptions = {
      method: 'POST',
      url: '/admin/categories',
      handler: createCategoryController.handle.bind(createCategoryController)
    }

    const updateRoute: RouteOptions = {
      method: 'PATCH',
      url: '/admin/categories/:categoryId',
      handler: updateCategoriesController.handle.bind(updateCategoriesController)
    }

    return [
      listRoute,
      createRoute,
      updateRoute
    ];
  }
}
