import { FastifyReply, FastifyRequest } from 'fastify';

import JsonApiStoreTransformer from '../transformer/json-api-store-transformer';
import { ListStoresQuery } from '../../../application/store/query/list-stores/list-stores-query';
import ListStoresQueryHandler from '../../../application/store/query/list-stores/list-stores-query-handler';

export default class ListStoresController {
  constructor(
    private readonly listStoresQueryHandler: ListStoresQueryHandler,
    private readonly jsonApiStoreTransformer: JsonApiStoreTransformer
  ) {}

  handle = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = new ListStoresQuery();
    const stores = await this.listStoresQueryHandler.execute(query);
    const jsonApi = await this.jsonApiStoreTransformer.transformArray(stores);

    reply.status(200).send({
        data: jsonApi
    });
  };
}
