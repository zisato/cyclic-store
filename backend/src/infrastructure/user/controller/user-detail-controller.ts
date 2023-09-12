import { FastifyReply, FastifyRequest } from 'fastify';

import { GetStoreBySellerQuery } from '../../../application/store/query/get-store-by-seller/get-store-by-seller-query';
import GetStoreBySellerQueryHandler from '../../../application/store/query/get-store-by-seller/get-store-by-seller-query-handler';
import { GetUserByIdQuery } from '../../../application/user/query/get-user-by-id/get-user-by-id-query';
import GetUserByIdQueryHandler from '../../../application/user/query/get-user-by-id/get-user-by-id-query-handler';
import JsonApiUserTransformer from '../transformer/json-api-user-transformer';
import { Store } from '../../../domain/store/store';
import UserRequestService from '../../fastify/user-request-service';

export default class UserDetailController {
    constructor(
        private readonly userRequestService: UserRequestService,
        private readonly getUserByIdQueryHandler: GetUserByIdQueryHandler,
        private readonly getStoreBySellerQueryHandler: GetStoreBySellerQueryHandler,
        private readonly jsonApiUserTransformer: JsonApiUserTransformer
    ) {}

    handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const userRequest = this.userRequestService.getUser(request);
        const getUserByIdQuery = new GetUserByIdQuery(userRequest.id);
        const user = await this.getUserByIdQueryHandler.execute(getUserByIdQuery);

        let store: Store | undefined = undefined;
        try {
            const getStoreBySellerQuery = new GetStoreBySellerQuery(user.id);
            store = await this.getStoreBySellerQueryHandler.execute(getStoreBySellerQuery)
        } catch (error) {}

        const userJsonApi = await this.jsonApiUserTransformer.transform(user, store);

        return reply.status(200).send({
            data: userJsonApi
        });
    }
}
