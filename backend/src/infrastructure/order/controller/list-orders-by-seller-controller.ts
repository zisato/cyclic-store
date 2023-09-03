import { FastifyReply, FastifyRequest } from 'fastify';

import JsonApiOrderTransformer from '../transformer/json-api-order-transformer';
import { ListStoreOrdersQuery } from '../../../application/order/query/list-store-orders/list-store-orders-query';
import ListStoreOrdersQueryHandler from '../../../application/order/query/list-store-orders/list-store-orders-query-handler';
import UserRequestService from '../../fastify/user-request-service';
import GetStoreBySellerQueryHandler from '../../../application/store/query/get-store-by-seller/get-store-by-seller-query-handler';
import { GetStoreBySellerQuery } from '../../../application/store/query/get-store-by-seller/get-store-by-seller-query';

export default class ListOrdersBySellerController {
  constructor(
    private readonly userRequestService: UserRequestService,
    private readonly getStoreBySellerQueryHandler: GetStoreBySellerQueryHandler,
    private readonly listStoreOrdersQueryHandler: ListStoreOrdersQueryHandler,
    private readonly jsonApiOrderTransformer: JsonApiOrderTransformer
  ) {}

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const storeId = await this.getStoreId(request)

    const query = new ListStoreOrdersQuery(storeId);
    const orders = await this.listStoreOrdersQueryHandler.execute(query);

    const jsonApi = await this.jsonApiOrderTransformer.transformArray(orders);

    reply.status(200).send({
        data: jsonApi
    });
  };

  private async getStoreId(request: FastifyRequest): Promise<string> {
    const seller = this.userRequestService.getUser(request);

    const query = new GetStoreBySellerQuery(seller.id);
    const store = await this.getStoreBySellerQueryHandler.execute(query);

    return store.id
  }
}
