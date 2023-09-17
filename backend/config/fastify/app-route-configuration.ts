import AddSellerRoleController from '../../src/infrastructure/user/controller/add-seller-role-controller';
import CompleteOrderController from '../../src/infrastructure/order/controller/complete-order-controller';
import { Container } from '../../src/shared/kernel/container/container';
import CreateCategoryController from '../../src/infrastructure/category/controller/create-category-controller';
import CreateOrderController from '../../src/infrastructure/order/controller/create-order-controller';
import CreateProductController from '../../src/infrastructure/product/controller/create-product-controller';
import CreateStoreController from '../../src/infrastructure/store/controller/create-store-controller';
import CustomerAuthenticatedHandler from '../../src/infrastructure/fastify/pre-handler/customer-authenticated-handler';
import { DeleteItemController } from '../../src/infrastructure/dynamodb/controller/delete-item-controller';
import { DeleteTableController } from '../../src/infrastructure/dynamodb/controller/delete-table-controller';
import DetailProductController from '../../src/infrastructure/product/controller/detail-product-controller';
import { DetailTableController } from '../../src/infrastructure/dynamodb/controller/detail-table-controller';
import IndexController from '../../src/infrastructure/controller/index-controller';
import ListCategoriesController from '../../src/infrastructure/category/controller/list-categories-controller';
import { ListItemsController } from '../../src/infrastructure/dynamodb/controller/list-items-controller';
import ListOrdersBySellerController from '../../src/infrastructure/order/controller/list-orders-by-seller-controller';
import ListProductsByStoreController from '../../src/infrastructure/product/controller/list-products-by-store-controller';
import ListProductsController from '../../src/infrastructure/product/controller/list-products-controller';
import ListStoresController from '../../src/infrastructure/store/controller/list-stores-controller';
import { ListTablesController } from '../../src/infrastructure/dynamodb/controller/list-tables-controller';
import LoginCallbackController from '../../src/infrastructure/user/controller/login-callback-controller';
import { RouteConfiguration } from '../../src/shared/kernel/configuration/fastify/router-configuration';
import { RouteOptions } from 'fastify';
import SellerAuthenticatedHandler from '../../src/infrastructure/fastify/pre-handler/seller-authenticated-handler';
import StatusController from '../../src/infrastructure/controller/status-controller';
import StoreDetailController from '../../src/infrastructure/store/controller/store-detail-controller';
import UpdateCategoryController from '../../src/infrastructure/category/controller/update-category-controller';
import { UpdateItemController } from '../../src/infrastructure/dynamodb/controller/update-item-controller';
import UpdateProductController from '../../src/infrastructure/product/controller/update-product-controller';
import UserDetailController from '../../src/infrastructure/user/controller/user-detail-controller';

export class AppRouteConfiguration implements RouteConfiguration {
  getRoutesOption(container: Container): RouteOptions[] {
    const commonRoutesOptions = this.commonRoutesOptions(container);
    const categoryRoutesOptions = this.categoryRoutesOptions(container);
    const orderRoutesOptions = this.orderRoutesOptions(container);
    const productRoutesOptions = this.productRoutesOptions(container);
    const storeRoutesOptions = this.storeRoutesOptions(container);
    const userRoutesOptions = this.userRoutesOptions(container);
    const authRoutesOptions = this.authRoutesOptions(container);
    const dynamoRouteOptions = this.dynamoRoutesOptions(container);

    return [
      ...commonRoutesOptions,
      ...categoryRoutesOptions,
      ...orderRoutesOptions,
      ...productRoutesOptions,
      ...storeRoutesOptions,
      ...userRoutesOptions,
      ...authRoutesOptions,
      ...dynamoRouteOptions
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

  private orderRoutesOptions(container: Container): RouteOptions[] {
    const customerAuthenticatedHandler = container.getTyped(CustomerAuthenticatedHandler);
    const sellerAuthenticatedHandler = container.getTyped(SellerAuthenticatedHandler);

    const createOrderController = container.getTyped(CreateOrderController)
    const listOrdersBySellerController = container.getTyped(ListOrdersBySellerController)
    const completeOrderController = container.getTyped(CompleteOrderController)

    const createRoute: RouteOptions = {
      method: 'POST',
      url: '/orders',
      preHandler: [
        customerAuthenticatedHandler.handle.bind(customerAuthenticatedHandler)
      ],
      handler: createOrderController.handle.bind(createOrderController)
    }

    const listBySellerRoute: RouteOptions = {
      method: 'GET',
      url: '/admin/orders',
      preHandler: [
        sellerAuthenticatedHandler.handle.bind(sellerAuthenticatedHandler)
      ],
      handler: listOrdersBySellerController.handle.bind(listOrdersBySellerController)
    }

    const completeRoute: RouteOptions = {
      method: 'POST',
      url: '/admin/orders/:orderId/complete',
      preHandler: [
        sellerAuthenticatedHandler.handle.bind(sellerAuthenticatedHandler)
      ],
      handler: completeOrderController.handle.bind(completeOrderController)
    }

    return [
      createRoute,
      completeRoute,
      listBySellerRoute
    ]
  }

  private productRoutesOptions(container: Container): RouteOptions[] {
    const customerAuthenticatedHandler = container.getTyped(CustomerAuthenticatedHandler);
    const sellerAuthenticatedHandler = container.getTyped(SellerAuthenticatedHandler);

    const createProductController = container.getTyped(CreateProductController);
    const detailProductController = container.getTyped(DetailProductController);
    const listProductsByStoreController = container.getTyped(ListProductsByStoreController);
    const updateProductController = container.getTyped(UpdateProductController);
    const listProductsController = container.getTyped(ListProductsController);

    const listByStoreRoute: RouteOptions = {
      method: 'GET',
      url: '/stores/:storeId/products',
      preHandler: [
        customerAuthenticatedHandler.handle.bind(sellerAuthenticatedHandler)
      ],
      handler: listProductsByStoreController.handle.bind(listProductsByStoreController)
    }

    const listRoute: RouteOptions = {
      method: 'GET',
      url: '/admin/products',
      preHandler: [
        sellerAuthenticatedHandler.handle.bind(sellerAuthenticatedHandler)
      ],
      handler: listProductsController.handle.bind(listProductsController)
    }

    const detailRoute: RouteOptions = {
      method: 'GET',
      url: '/admin/products/:productId',
      preHandler: [
        sellerAuthenticatedHandler.handle.bind(sellerAuthenticatedHandler)
      ],
      handler: detailProductController.handle.bind(detailProductController)
    }

    const createRoute: RouteOptions = {
      method: 'POST',
      url: '/admin/products',
      preHandler: [
        sellerAuthenticatedHandler.handle.bind(sellerAuthenticatedHandler)
      ],
      handler: createProductController.handle.bind(createProductController)
    }

    const updateRoute: RouteOptions = {
      method: 'PATCH',
      url: '/admin/products/:productId',
      preHandler: [
        sellerAuthenticatedHandler.handle.bind(sellerAuthenticatedHandler)
      ],
      handler: updateProductController.handle.bind(updateProductController)
    }

    return [
      listByStoreRoute,
      listRoute,
      detailRoute,
      createRoute,
      updateRoute
    ];
  }

  private storeRoutesOptions(container: Container): RouteOptions[] {
    const customerAuthenticatedHandler = container.getTyped(CustomerAuthenticatedHandler);
    const sellerAuthenticatedHandler = container.getTyped(SellerAuthenticatedHandler);

    const listStoresController = container.getTyped(ListStoresController);
    const storeDetailController = container.getTyped(StoreDetailController);
    const createStoreController = container.getTyped(CreateStoreController);

    const listRoute: RouteOptions = {
      method: 'GET',
      url: '/stores',
      preHandler: [
        customerAuthenticatedHandler.handle.bind(customerAuthenticatedHandler)
      ],
      handler: listStoresController.handle.bind(listStoresController)
    }

    const detailRoute: RouteOptions = {
      method: 'GET',
      url: '/stores/:storeId',
      preHandler: [
        sellerAuthenticatedHandler.handle.bind(sellerAuthenticatedHandler)
      ],
      handler: storeDetailController.handle.bind(storeDetailController)
    }

    const createRoute: RouteOptions = {
      method: 'POST',
      url: '/admin/stores',
      preHandler: [
        sellerAuthenticatedHandler.handle.bind(sellerAuthenticatedHandler)
      ],
      handler: createStoreController.handle.bind(createStoreController)
    }

    return [
      listRoute,
      detailRoute,
      createRoute,
    ];
  }

  private userRoutesOptions(container: Container): RouteOptions[] {
    const customerAuthenticatedHandler = container.getTyped(CustomerAuthenticatedHandler);

    const userDetailController = container.getTyped(UserDetailController);
    const addSellerRoleController = container.getTyped(AddSellerRoleController);

    const userDetailRoleRoute: RouteOptions = {
      method: 'GET',
      url: '/users/me',
      preHandler: [
        customerAuthenticatedHandler.handle.bind(customerAuthenticatedHandler)
      ],
      handler: userDetailController.handle.bind(userDetailController)
    }

    const addSellerRoleRoute: RouteOptions = {
      method: 'POST',
      url: '/users/:customerId/roles/seller',
      preHandler: [
        customerAuthenticatedHandler.handle.bind(customerAuthenticatedHandler)
      ],
      handler: addSellerRoleController.handle.bind(addSellerRoleController)
    }

    return [
      userDetailRoleRoute,
      addSellerRoleRoute
    ];
  }

  private authRoutesOptions(container: Container): RouteOptions[] {
    const loginCallbackController = container.getTyped(LoginCallbackController);

    const loginCallbackRoute: RouteOptions = {
      method: 'POST',
      url: '/login/callback',
      handler: loginCallbackController.handle.bind(loginCallbackController)
    }

    return [
      loginCallbackRoute
    ];
  }

  private dynamoRoutesOptions(container: Container): RouteOptions[] {
    const listTablesController = container.getTyped(ListTablesController);
    const detailTableController = container.getTyped(DetailTableController);
    const listItemsController = container.getTyped(ListItemsController);
    const updateItemController = container.getTyped(UpdateItemController);
    const deleteItemController = container.getTyped(DeleteItemController);
    const deleteTableController = container.getTyped(DeleteTableController);

    const listTablesRoute: RouteOptions = {
      method: 'GET',
      url: '/dynamo/tables',
      handler: listTablesController.handle.bind(listTablesController)
    };

    const detailTableRoute: RouteOptions = {
      method: 'GET',
      url: '/dynamo/tables/:tableName',
      handler: detailTableController.handle.bind(detailTableController)
    };

    const listItemsRoute: RouteOptions = {
      method: 'GET',
      url: '/dynamo/tables/:tableName/items',
      handler: listItemsController.handle.bind(listItemsController)
    };

    const updateItemRoute: RouteOptions = {
      method: 'PUT',
      url: '/dynamo/tables/:tableName/items',
      handler: updateItemController.handle.bind(updateItemController)
    };

    const deleteItemRoute: RouteOptions = {
      method: 'DELETE',
      url: '/dynamo/tables/:tableName/items',
      handler: deleteItemController.handle.bind(deleteItemController)
    };

    const deleteTableRoute: RouteOptions = {
      method: 'DELETE',
      url: '/dynamo/tables/:tableName',
      handler: deleteTableController.handle.bind(deleteTableController)
    };

    return [
      listTablesRoute,
      detailTableRoute,
      listItemsRoute,
      updateItemRoute,
      deleteItemRoute,
      deleteTableRoute
    ]
  }
}
