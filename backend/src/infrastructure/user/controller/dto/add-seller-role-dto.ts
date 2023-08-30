import { FastifyRequest } from 'fastify';
import { RequestSchemaValidator } from '../../../json-schema/request-schema-validator';
import joi from 'joi';

type AddSellerRoleRequestParams = {
  customerId: string;
};

export class AddSellerRoleDto {
  private readonly validationSchema: joi.ObjectSchema<AddSellerRoleRequestParams> =
    joi.object({
      customerId: joi.string().required(),
    });

  readonly requestParams;

  constructor(request: FastifyRequest) {
    this.requestParams = RequestSchemaValidator.validate(
      request.params as object,
      this.validationSchema
    );
  }
}