import { FastifyReply, FastifyRequest } from 'fastify';

import { DynamoClient } from '../../../shared/dynamo/dynamo-client';
import { RequestSchemaValidator } from '../../json-schema/request-schema-validator';
import joi from 'joi';

type UpdateItemRequestParams = {
  tableName: string;
}

type UpdateItemRequestBody = {
  value: Record<string, unknown>;
}

class UpdateItemDto {
  private readonly paramsValidationSchema: joi.ObjectSchema<UpdateItemRequestParams> =
    joi.object({
      tableName: joi.string().required(),
    });

  private readonly bodyValidationSchema: joi.ObjectSchema<UpdateItemRequestBody> =
    joi.object({
      value: joi.object().required(),
    });

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

export default class UpdateItemController {
  constructor(private readonly dynamoClient: DynamoClient) { }

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const updateItemDto = new UpdateItemDto(request);

    await this.dynamoClient.save(
      updateItemDto.requestParams.tableName,
      updateItemDto.requestBody.value
    );

    reply.status(201).send();
  }
}