import { FastifyReply, FastifyRequest } from 'fastify';

import { UserNotAuthenticatedError } from '../../error/user-not-authenticated-error';
import { UserNotAuthorizedError } from '../../error/user-not-authorized-error';

export default class SellerAuthenticatedHandler {
  handle = async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const user = request.user;
    if (!user) {
      throw new UserNotAuthenticatedError();
    }

    if (!user.isSeller()) {
      throw new UserNotAuthorizedError();
    }
  };
}
