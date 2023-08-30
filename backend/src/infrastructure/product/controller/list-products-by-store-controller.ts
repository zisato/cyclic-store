import JsonApiProductTransformer from '../transformer/json-api-product-transformer';
import ListProductsByStoreQueryHandler from '../../../application/product/query/list-products-by-store/list-products-by-store-query-handler';
import { ListProductsByStoreQuery } from '../../../application/product/query/list-products-by-store/list-products-by-store-query';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ListProductsByStoreDto } from './dto/list-products-by-store-dto';

export default class ListProductsByStoreController {
  constructor(
    private readonly listProductsByStoreQueryHandler: ListProductsByStoreQueryHandler,
    private readonly jsonApiProductTransformer: JsonApiProductTransformer
  ) { }

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const listProductsByStoreDto = new ListProductsByStoreDto(request)

    const query = new ListProductsByStoreQuery(listProductsByStoreDto.requestParams.storeId);
    const products = await this.listProductsByStoreQueryHandler.execute(query);
    const productsJsonApi = await this.jsonApiProductTransformer.transformArray(products);

    reply.status(200).send({
      data: productsJsonApi,
    });
  };
}
