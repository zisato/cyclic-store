import { FastifyRequest } from 'fastify';
import { RequestSchemaValidator } from '../../../json-schema/request-schema-validator';
import joi from 'joi';

type UpdateCategoryRequestParams = {
  categoryId: string;
};

type UpdateCategoryRequestBody = {
  data: {
    attributes: {
      name: string;
    };
  };
};

export class UpdateCategoryDto {
  private readonly requestParamsValidationSchema: joi.ObjectSchema<UpdateCategoryRequestParams> =
    joi.object({
      categoryId: joi.string().required(),
    });
  private readonly requestBodyValidationSchema: joi.ObjectSchema<UpdateCategoryRequestBody> =
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
