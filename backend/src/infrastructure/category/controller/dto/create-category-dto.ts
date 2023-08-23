import { FastifyRequest } from 'fastify';
import { RequestSchemaValidator } from '../../../json-schema/request-schema-validator';
import joi from 'joi';

type CreateCategoryRequestBody = {
  data: {
    id: string;
    attributes: {
      name: string;
    };
  };
};

export class CreateCategoryDto {
  private readonly validationSchema: joi.ObjectSchema<CreateCategoryRequestBody> =
    joi.object({
      data: joi.object({
        id: joi.string().required(),
        attributes: joi
          .object({
            name: joi.string().required(),
          })
          .required(),
      }),
    });

  readonly requestBody;

  constructor(request: FastifyRequest) {
    this.requestBody = RequestSchemaValidator.validate(
      request.body as object,
      this.validationSchema
    );
  }
}
