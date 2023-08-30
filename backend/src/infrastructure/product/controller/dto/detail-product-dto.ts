import { FastifyRequest } from 'fastify';
import { RequestSchemaValidator } from '../../../json-schema/request-schema-validator';
import joi from 'joi';

type DetailProductRequestParams = {
  productId: string
};

export class DetailProductDto {
  private readonly validationSchema: joi.ObjectSchema<DetailProductRequestParams> =
    joi.object({
      productId: joi.string().required()
    });

  readonly requestParams;

  constructor(request: FastifyRequest) {
    this.requestParams = RequestSchemaValidator.validate(
      request.params as object,
      this.validationSchema
    );
  }
}
