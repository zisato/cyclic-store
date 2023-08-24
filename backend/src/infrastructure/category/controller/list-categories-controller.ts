import { FastifyReply, FastifyRequest } from 'fastify';
import ListCategoriesQueryHandler from '../../../application/category/query/list-categories/list-categories-query-handler';
import { ListCategoriesQuery } from '../../../application/category/query/list-categories/list-categories-query';
import JsonApiCategoryTransformer from '../transformer/json-api-category-transformer';

export default class ListCategoriesController {
  constructor(
    private readonly listCategoriesQueryHandler: ListCategoriesQueryHandler,
    private readonly jsonApiCategoryTransformer: JsonApiCategoryTransformer
  ) {}

  handle = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const query = new ListCategoriesQuery();
    const categories = await this.listCategoriesQueryHandler.execute(query);
    const jsonApi = await this.jsonApiCategoryTransformer.transformArray(categories);

    reply.status(200).send({
        data: jsonApi
    });
  };
}
