import { FastifyRequest } from 'fastify';
import { User } from '../../../../src/domain/user/user';
import { UserNotAuthenticatedError } from '../../../../src/infrastructure/error/user-not-authenticated-error'
import UserRequestService from '../../../../src/infrastructure/fastify/user-request-service';

describe('UserRequestService unit test', () => {
  const stubs: {
    request: FastifyRequest & { user?: User }
  } = {
    request: {} as FastifyRequest
  }

  const service = new UserRequestService()

  test('Should throw error when request not contains user property', async () => {
    const expectedError = new UserNotAuthenticatedError()

    expect(() => {
        service.getUser(stubs.request)
    }).toThrow(expectedError)
  });

  test('Should return request user property', async () => {
    stubs.request.user = new User({ id: '12345', providerId: 'provider-id', roles: ['seller'] })

    const result = service.getUser(stubs.request)

    const expectedResult = new User({ id: '12345', providerId: 'provider-id', roles: ['seller'] })
    expect(result).toEqual(expectedResult)
  });
})