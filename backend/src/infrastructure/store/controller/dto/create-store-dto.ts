import { FastifyRequest } from 'fastify';
import { RequestSchemaValidator } from '../../../json-schema/request-schema-validator';
import joi from 'joi';

type CreateStoreRequestBody = {
  data: {
    id: string;
    attributes: {
      name: string;
    };
  };
};

export class CreateStoreDto {
  private readonly validationSchema: joi.ObjectSchema<CreateStoreRequestBody> =
    joi.object({
      data: joi.object({
        id: joi.string().required(),
        attributes: joi
          .object({
            name: joi.string().required(),
          })
          .required(),
      }).required(),
    });

  readonly requestBody;

  constructor(request: FastifyRequest) {
    this.requestBody = RequestSchemaValidator.validate(
      request.body as object,
      this.validationSchema
    );
  }
}
