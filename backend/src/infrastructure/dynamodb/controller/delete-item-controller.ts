import { FastifyReply, FastifyRequest } from 'fastify';

import { DynamoClient } from '../../../shared/dynamo/dynamo-client';
import { RequestSchemaValidator } from '../../json-schema/request-schema-validator';
import joi from 'joi';

type DeleteItemRequestParams = {
  tableName: string;
}
type DeleteItemRequestBody = {
  [key: string]: string | number;
}

class DeleteItemDto {
  private readonly paramsValidationSchema: joi.ObjectSchema<DeleteItemRequestParams> =
    joi.object({
      tableName: joi.string().required(),
    });
  private readonly bodyValidationSchema: joi.ObjectSchema<DeleteItemRequestBody> =
    joi.object();

  readonly requestParams;
  readonly requestBody;

  constructor(request: FastifyRequest) {
    this.requestParams = RequestSchemaValidator.validate(
      request.params as object,
      this.paramsValidationSchema
    );
    this.requestBody = RequestSchemaValidator.validate(
      request.body as object,
      this.bodyValidationSchema
    );
  }
}

export default class DeleteItemController {
  constructor(private readonly dynamoClient: DynamoClient) {}

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const deleteItemDto = new DeleteItemDto(request);
    await this.dynamoClient.delete(deleteItemDto.requestParams.tableName, deleteItemDto.requestBody);

    console.log(deleteItemDto.requestParams.tableName, deleteItemDto.requestBody.primaryKeys)
    reply.status(201).send();
  }
}