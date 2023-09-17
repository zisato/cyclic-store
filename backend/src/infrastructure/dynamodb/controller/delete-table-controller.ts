import { FastifyReply, FastifyRequest } from 'fastify';

import { DynamoClient } from '../../../shared/dynamo/dynamo-client';
import { RequestSchemaValidator } from '../../json-schema/request-schema-validator';
import joi from 'joi';

type DeleteTableRequestParams = {
    tableName: string;
}

class DeleteTableDto {
    private readonly validationSchema: joi.ObjectSchema<DeleteTableRequestParams> =
    joi.object({
      tableName: joi.string().required(),
    });

    readonly requestParams;

    constructor(request: FastifyRequest) {
      this.requestParams = RequestSchemaValidator.validate(
        request.params as object,
        this.validationSchema
      );
    }
}

export class DeleteTableController {
    constructor(private readonly dynamoClient: DynamoClient) {}

    handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const deleteTableDto = new DeleteTableDto(request);
        const tableName = deleteTableDto.requestParams.tableName;
        await this.dynamoClient.deleteTable(tableName);

        reply.status(201).send();
    }
}