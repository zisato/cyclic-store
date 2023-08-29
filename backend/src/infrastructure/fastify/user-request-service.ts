import { FastifyRequest } from 'fastify';
import { User } from '../../domain/user/user';
import { UserNotAuthenticatedError } from '../error/user-not-authenticated-error';

export default class UserRequestService {
  getUser(request: FastifyRequest): User {
    if (!request.user) {
      throw new UserNotAuthenticatedError();
    }

    return request.user;
  }
}