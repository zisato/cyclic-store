import { FastifyReply, FastifyRequest } from 'fastify';

import { DynamoClient } from '../../../shared/dynamo/dynamo-client';

export default class ListTablesController {
    constructor(private readonly dynamoClient: DynamoClient) {}

    handle = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const results = await this.dynamoClient.getTablesName();

        reply.status(200).send({
            data: results
        });
    }
}