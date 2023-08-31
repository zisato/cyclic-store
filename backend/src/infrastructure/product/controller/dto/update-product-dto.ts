import { FastifyRequest } from 'fastify';
import { RequestSchemaValidator } from '../../../json-schema/request-schema-validator';
import joi from 'joi';

type UpdateProductRequestParams = {
  productId: string;
};

type UpdateProductRequestBody = {
  data: {
    attributes: {
      name: string | undefined;
    } | undefined;
  } | undefined;
};

export class UpdateProductDto {
  private readonly requestParamsValidationSchema: joi.ObjectSchema<UpdateProductRequestParams> =
    joi.object({
      productId: joi.string().required(),
    });
  private readonly requestBodyValidationSchema: joi.ObjectSchema<UpdateProductRequestBody> =
    joi.object({
      data: joi.object({
        attributes: joi.object({
          name: joi.string(),
        }),
      }),
    });

  readonly requestParams;
  readonly requestBody;

  constructor(request: FastifyRequest) {
    this.requestParams = RequestSchemaValidator.validate(
      request.params as object,
      this.requestParamsValidationSchema
    );
    this.requestBody = RequestSchemaValidator.validate(
      request.body as object,
      this.requestBodyValidationSchema
    );
  }
}
