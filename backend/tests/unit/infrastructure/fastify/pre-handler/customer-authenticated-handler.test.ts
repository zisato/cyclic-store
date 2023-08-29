import { FastifyReply, FastifyRequest } from 'fastify';

import CustomerAuthenticatedHandler from '../../../../../src/infrastructure/fastify/pre-handler/customer-authenticated-handler';
import FindUserByTokenQueryHandler from '../../../../../src/application/user/query/find-user-by-token/find-user-by-token-query-handler';
import { User } from '../../../../../src/domain/user/user';
import { UserNotAuthenticatedError } from '../../../../../src/infrastructure/error/user-not-authenticated-error'
import { UserNotAuthorizedError } from '../../../../../src/infrastructure/error/user-not-authorized-error'

describe('CustomerAuthenticatedHandler unit test', () => {
  const stubs: {
    request: FastifyRequest & { user?: User }
    reply: FastifyReply
    findUserByTokenQueryHandler: Partial<FindUserByTokenQueryHandler>
  } = {
    request: {} as FastifyRequest,
    reply: {} as FastifyReply,
    findUserByTokenQueryHandler: {
      execute: jest.fn()
    }
  }

  const preHandler = new CustomerAuthenticatedHandler()

  test('Should throw error when request not contains user property', async () => {
    const promise = preHandler.handle(stubs.request, stubs.reply)

    const expectedError = new UserNotAuthenticatedError()
    await expect(promise).rejects.toThrowError(expectedError)
  });

  test('Should throw error when request user is not customer', async () => {
    stubs.request.user = new User({ id: 'user-id', providerId: 'provider-id', roles: ['seller'] })

    const promise = preHandler.handle(stubs.request, stubs.reply)

    const expectedError = new UserNotAuthorizedError()
    await expect(promise).rejects.toThrowError(expectedError)
  });
})