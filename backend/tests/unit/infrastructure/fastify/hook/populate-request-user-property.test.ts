import { FastifyRequest } from 'fastify';
import FindUserByTokenQueryHandler from '../../../../../src/application/user/query/find-user-by-token/find-user-by-token-query-handler';
import PopulateRequestUserProperty from '../../../../../src/infrastructure/fastify/hook/populate-request-user-property';
import { User } from '../../../../../src/domain/user/user';

describe('PopulateRequestUserProperty unit test', () => {
    const stubs: {
      request: FastifyRequest & { user?: User }
      findUserByTokenQueryHandler: Partial<FindUserByTokenQueryHandler>
    } = {
      request: {
        headers: {}
      } as FastifyRequest,
      findUserByTokenQueryHandler: {
        execute: jest.fn()
      }
    }
  
    const hookHandler = new PopulateRequestUserProperty(stubs.findUserByTokenQueryHandler as FindUserByTokenQueryHandler)

    test('Should do nothing when undefined authorization header', async () => {  
      await hookHandler.callback(stubs.request as FastifyRequest)
  
      expect(stubs.findUserByTokenQueryHandler.execute).not.toHaveBeenCalled();
    });
  
    test('When authorization header, should call findUserByTokenQueryHandler.execute times with arguments', async () => {
        stubs.request.headers.authorization = 'Bearer awesome-token'

        await hookHandler.callback(stubs.request as FastifyRequest)

        const expectedTimes = 1
        const expectedArguments = {
            token: 'awesome-token'
        }
        expect(stubs.findUserByTokenQueryHandler.execute).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.findUserByTokenQueryHandler.execute).toHaveBeenCalledWith(expectedArguments)
    });
  
    test('When authorization header, should add user property to request', async () => {
        const user = new User({ id: 'user-id', providerId: 'provider-id', roles: ['customer'] })
        stubs.findUserByTokenQueryHandler.execute = jest.fn().mockResolvedValueOnce(user)
        stubs.request.headers.authorization = 'Bearer awesome-token'

        await hookHandler.callback(stubs.request as FastifyRequest)

        const expectedUser = new User({
            id: 'user-id',
            providerId: 'provider-id',
            roles: ['customer']
        })
        expect(stubs.request.user).toEqual(expectedUser)
    });
  })