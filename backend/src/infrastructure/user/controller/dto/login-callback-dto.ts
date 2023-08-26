import { FastifyRequest } from 'fastify';
import { RequestSchemaValidator } from '../../../json-schema/request-schema-validator';
import joi from 'joi';

type LoginCallbackequestBody = {
    data: {
      id: string;
      attributes: {
        token: string;
      };
    };
  };

export class LoginCallbackDto {
  private readonly validationSchema: joi.ObjectSchema<LoginCallbackequestBody> =
    joi.object({
      data: joi.object({
        id: joi.string().required(),
        attributes: joi
          .object({
            token: joi.string().required(),
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