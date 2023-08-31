import { FastifyRequest } from 'fastify';
import { RequestSchemaValidator } from '../../../json-schema/request-schema-validator';
import joi from 'joi';

type StoreDetailRequestParams = {
  storeId: string
};

export class StoreDetailDto {
  private readonly validationSchema: joi.ObjectSchema<StoreDetailRequestParams> =
    joi.object({
      storeId: joi.string().required()
    });

  readonly requestParams;

  constructor(request: FastifyRequest) {
    this.requestParams = RequestSchemaValidator.validate(
      request.params as object,
      this.validationSchema
    );
  }
}
