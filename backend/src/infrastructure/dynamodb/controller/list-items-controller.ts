import { FastifyReply, FastifyRequest } from 'fastify';

import { DynamoClient } from '../../../shared/dynamo/dynamo-client';
import { RequestSchemaValidator } from '../../json-schema/request-schema-validator';
import joi from 'joi';

type ListItemsDtoRequestParams = {
    tableName: string;
}

class ListItemsDto {
    private readonly validationSchema: joi.ObjectSchema<ListItemsDtoRequestParams> =
    joi.object({
      tableName: joi.string().required(),
    });

    readonly requestParams;

    constructor(request: FastifyRequest) {
      this.requestParams = RequestSchemaValidator.validate(
        request.query as object,
        this.validationSchema
      );
    }
}

export default class ListItemsController {
    constructor(private readonly dynamoClient: DynamoClient) {}

    handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const listItemsDto = new ListItemsDto(request);
        const tableName = listItemsDto.requestParams.tableName;
        const results = await this.dynamoClient.find(tableName);

        reply.status(200).send({
          data: results
        });
    }
}