import { FastifyReply, FastifyRequest } from 'fastify';

import { DynamoClient } from '../../../shared/dynamo/dynamo-client';
import { RequestSchemaValidator } from '../../json-schema/request-schema-validator';
import joi from 'joi';

type DetailTableDtoRequestParams = {
    tableName: string;
}

class DetailTableDto {
    private readonly validationSchema: joi.ObjectSchema<DetailTableDtoRequestParams> =
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

export default class DetailTableController {
    constructor(private readonly dynamoClient: DynamoClient) { }

    handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const detailTableDto = new DetailTableDto(request);
        const tableName = detailTableDto.requestParams.tableName;
        const results = await this.dynamoClient.describeTable(tableName);

        reply.status(200).send({
            data: results
        });
    }
}