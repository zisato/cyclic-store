import { UserNotAuthenticatedError } from '../../error/user-not-authenticated-error';
import { UserNotAuthorizedError } from '../../error/user-not-authorized-error';
import { FastifyRequest, FastifyReply } from 'fastify';

export default class CustomerAuthenticatedHandler {
  handle = async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    const user = request.user;
    if (!user) {
      throw new UserNotAuthenticatedError();
    }

    if (!user.isCustomer()) {
      throw new UserNotAuthorizedError();
    }
  };
}
