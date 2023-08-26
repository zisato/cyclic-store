import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateCustomerFromTokenCommand } from '../../../application/user/command/create-customer-from-token/create-customer-from-token-command';
import CreateCustomerFromTokenCommandHandler from '../../../application/user/command/create-customer-from-token/create-customer-from-token-command-handler';
import { FindUserByTokenQuery } from '../../../application/user/query/find-user-by-token/find-user-by-token-query';
import FindUserByTokenQueryHandler from '../../../application/user/query/find-user-by-token/find-user-by-token-query-handler';
import JsonApiUserTransformer from '../transformer/json-api-user-transformer';
import { LoginCallbackDto } from './dto/login-callback-dto';

export default class LoginCallbackController {
    constructor(
        private readonly createCustomerFromTokenCommandHandler: CreateCustomerFromTokenCommandHandler,
        private readonly findUserByTokenQueryHandler: FindUserByTokenQueryHandler,
        private readonly jsonApiUserTransformer: JsonApiUserTransformer
    ) {}

    handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const loginCallbackDto = new LoginCallbackDto(request);
        const token = loginCallbackDto.requestBody.data.attributes.token

        const command = new CreateCustomerFromTokenCommand(loginCallbackDto.requestBody.data.id, token);
        await this.createCustomerFromTokenCommandHandler.execute(command);

        const query = new FindUserByTokenQuery(token);
        const user = await this.findUserByTokenQueryHandler.execute(query);

        const userJsonApi = await this.jsonApiUserTransformer.transform(user);

        return reply.status(200).send({
            data: userJsonApi
        });
    }
}
