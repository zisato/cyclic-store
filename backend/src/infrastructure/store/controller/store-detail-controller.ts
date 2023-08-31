import { FastifyReply, FastifyRequest } from 'fastify';

import { GetStoreByIdQuery } from '../../../application/store/query/get-store-by-id/get-store-by-id-query';
import GetStoreByIdQueryHandler from '../../../application/store/query/get-store-by-id/get-store-by-id-query-handler';
import JsonApiStoreTransformer from '../transformer/json-api-store-transformer';
import { StoreDetailDto } from './dto/store-detail-dto';

export default class StoreDetailController {
  constructor(
    private readonly getStoreByIdQueryHandler: GetStoreByIdQueryHandler,
    private readonly jsonApiStoreTransformer: JsonApiStoreTransformer
  ) {}

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const storeDetailDto = new StoreDetailDto(request);

    const query = new GetStoreByIdQuery(storeDetailDto.requestParams.storeId);
    const store = await this.getStoreByIdQueryHandler.execute(query);

    const jsonApi = await this.jsonApiStoreTransformer.transform(store);

    reply.status(200).send({
        data: jsonApi
    });
  };
}
