import { FastifyReply, FastifyRequest } from 'fastify';
import { DetailProductDto } from './dto/detail-product-dto';
import { DetailProductQuery } from '../../../application/product/query/detail-product/detail-product-query';
import JsonApiProductTransformer from '../transformer/json-api-product-transformer';
import DetailProductQueryHandler from '../../../application/product/query/detail-product/detail-product-query-handler';

export default class DetailProductController {
  constructor(
    private readonly detailProductQueryHandler: DetailProductQueryHandler,
    private readonly jsonApiProductTransformer: JsonApiProductTransformer
  ) { }

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const detailProductDto = new DetailProductDto(request)

    const query = new DetailProductQuery(detailProductDto.requestParams.productId);
    const product = await this.detailProductQueryHandler.execute(query);
    const productJsonApi = await this.jsonApiProductTransformer.transform(product);

    reply.status(200).send({
      data: productJsonApi,
    });
  };
}
