import { FastifyReply, FastifyRequest } from 'fastify';

import { GetStoreBySellerQuery } from '../../../application/store/query/get-store-by-seller/get-store-by-seller-query';
import GetStoreBySellerQueryHandler from '../../../application/store/query/get-store-by-seller/get-store-by-seller-query-handler';
import JsonApiProductTransformer from '../transformer/json-api-product-transformer';
import { ListProductsByStoreQuery } from '../../../application/product/query/list-products-by-store/list-products-by-store-query';
import ListProductsByStoreQueryHandler from '../../../application/product/query/list-products-by-store/list-products-by-store-query-handler';
import UserRequestService from '../../fastify/user-request-service';

export default class ListProductsController {
  constructor(
    private readonly userRequestService: UserRequestService,
    private readonly getStoreBySellerQueryHandler: GetStoreBySellerQueryHandler,
    private readonly listProductsByStoreQueryHandler: ListProductsByStoreQueryHandler,
    private readonly jsonApiProductTransformer: JsonApiProductTransformer
  ) { }

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const storeId = await this.getStoreId(request)

    const query = new ListProductsByStoreQuery(storeId);
    const products = await this.listProductsByStoreQueryHandler.execute(query);
    const productsJsonApi = await this.jsonApiProductTransformer.transformArray(products);

    reply.status(200).send({
      data: productsJsonApi,
    });
  };

  private async getStoreId(request: FastifyRequest): Promise<string> {
    const seller = this.userRequestService.getUser(request);

    const query = new GetStoreBySellerQuery(seller.id);
    const store = await this.getStoreBySellerQueryHandler.execute(query);

    return store.id
  }
}
