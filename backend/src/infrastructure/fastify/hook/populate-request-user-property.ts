import { FastifyRequest } from 'fastify';
import { FindUserByTokenQuery } from '../../../application/user/query/find-user-by-token/find-user-by-token-query';
import FindUserByTokenQueryHandler from '../../../application/user/query/find-user-by-token/find-user-by-token-query-handler';
import { HookHandler } from '../../../shared/kernel/configuration/fastify/hook-configuration';

export default class PopulateRequestUserProperty implements HookHandler {
    constructor(private readonly findUserByTokenQueryHandler: FindUserByTokenQueryHandler) {}

    name = 'preParsing'

    callback = async (request: FastifyRequest): Promise<void> => {
        const authorizationHeader = request.headers.authorization;

        if (authorizationHeader !== undefined) {
            const token = authorizationHeader.replace('Bearer ', '');

            request.user = await this.findUserByTokenQueryHandler.execute(new FindUserByTokenQuery(token));
        }
    }
}
