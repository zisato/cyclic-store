import { FastifyReply, FastifyRequest } from 'fastify';

import LoginCallbackController from '../../../../../src/infrastructure/user/controller/login-callback-controller';
import CreateCustomerFromTokenCommandHandler from '../../../../../src/application/user/command/create-customer-from-token/create-customer-from-token-command-handler';
import FindUserByTokenQueryHandler from '../../../../../src/application/user/query/find-user-by-token/find-user-by-token-query-handler';
import JsonApiUserTransformer from '../../../../../src/infrastructure/user/transformer/json-api-user-transformer';
import { User } from '../../../../../src/domain/user/user';

describe('LoginCallbackController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest>
    reply: Partial<FastifyReply>
    createCustomerFromTokenCommandHandler: Partial<CreateCustomerFromTokenCommandHandler>
    findUserByTokenQueryHandler: Partial<FindUserByTokenQueryHandler>
    jsonApiUserTransformer: Partial<JsonApiUserTransformer>
  } = {
    request: {
      body: jest.fn()
    },
    reply: {
      send: jest.fn().mockImplementation(() => {
        return stubs.reply
      }),
      status: jest.fn().mockImplementation(() => {
        return stubs.reply
      })
    },
    createCustomerFromTokenCommandHandler: {
        execute: jest.fn()
    },
    findUserByTokenQueryHandler: {
        execute: jest.fn()
    },
    jsonApiUserTransformer: {
        transform: jest.fn()
    }
  }
  const controller = new LoginCallbackController(
    stubs.createCustomerFromTokenCommandHandler as CreateCustomerFromTokenCommandHandler,
    stubs.findUserByTokenQueryHandler as FindUserByTokenQueryHandler,
    stubs.jsonApiUserTransformer as JsonApiUserTransformer
  )

  function getValidRequestBody (id: string, token: string): any {
    return {
      data: {
        id,
        attributes: {
          token
        }
      }
    }
  }

  test.each([
    { // missing data
    },
    { // missing data.id
      data: {}
    },
    { // missing data.attributes
      data: {
        id: 'user-id'
      }
    },
    { // missing data.attributes.token
      data: {
        id: 'user-id',
        attributes: {}
      }
    }
  ])('Should throw Error when missing request body value %j', async (requestBody) => {
    // Given
    stubs.request.body = requestBody

    // When
    const result = controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    void expect(result).rejects.toThrow(Error)
  })

  test.each([
    // invalid id
    {
      data: {
        id: 123,
        attributes: {
          token: 'token'
        }
      }
    },
    {
      data: {
        id: false,
        attributes: {
          token: 'token'
        }
      }
    },
    {
      data: {
        id: null,
        attributes: {
          token: 'token'
        }
      }
    },
    // invalid token
    {
      data: {
        id: 'user-id',
        attributes: {
          token: 123
        }
      }
    },
    {
      data: {
        id: 'user-id',
        attributes: {
          token: false
        }
      }
    },
    {
      data: {
        id: 'user-id',
        attributes: {
          token: null
        }
      }
    }
  ])('Should throw Error when invalid request parameter value %j', async (requestBody) => {
    // Given
    stubs.request.body = requestBody

    // When
    const result = controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    void expect(result).rejects.toThrow(Error)
  })

  test('Should call createCustomerFromTokenCommandHandler.execute times with arguments', async () => {
    // Given
    const id = 'user-id'
    const providerId = 'provider-id'
    const token = 'awesome-token'
    const user = new User({ id, providerId, roles: ['customer']})
    const userJsonApi = {
        id,
        attributes: {
            roles: ['customer']
        }
    }
    stubs.request.body = getValidRequestBody(id, token)
    stubs.findUserByTokenQueryHandler.execute = jest.fn().mockResolvedValueOnce(user)
    stubs.jsonApiUserTransformer.transform = jest.fn().mockResolvedValueOnce(userJsonApi)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = {
      id: 'user-id',
      token: 'awesome-token'
    }
    expect(stubs.createCustomerFromTokenCommandHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.createCustomerFromTokenCommandHandler.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should call findUserByTokenQueryHandler.execute times with arguments', async () => {
    // Given
    const id = 'user-id'
    const providerId = 'provider-id'
    const token = 'awesome-token'
    const user = new User({ id, providerId, roles: ['customer']})
    const userJsonApi = {
        id,
        attributes: {
            roles: ['customer']
        }
    }
    stubs.request.body = getValidRequestBody(id, token)
    stubs.findUserByTokenQueryHandler.execute = jest.fn().mockResolvedValueOnce(user)
    stubs.jsonApiUserTransformer.transform = jest.fn().mockResolvedValueOnce(userJsonApi)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = {
      token: 'awesome-token'
    }
    expect(stubs.findUserByTokenQueryHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.findUserByTokenQueryHandler.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should call reply.status times with arguments', async () => {
    // Given
    const id = 'user-id'
    const providerId = 'provider-id'
    const token = 'awesome-token'
    const user = new User({ id, providerId, roles: ['customer']})
    const userJsonApi = {
        id,
        attributes: {
            roles: ['customer']
        }
    }
    stubs.request.body = getValidRequestBody(id, token)
    stubs.findUserByTokenQueryHandler.execute = jest.fn().mockResolvedValueOnce(user)
    stubs.jsonApiUserTransformer.transform = jest.fn().mockResolvedValueOnce(userJsonApi)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = 200
    expect(stubs.reply.status).toHaveBeenCalledTimes(1)
    expect(stubs.reply.status).toHaveBeenCalledWith(expected)
  })

  test('Should call reply.send times with arguments', async () => {
    // Given
    const id = 'user-id'
    const providerId = 'provider-id'
    const token = 'awesome-token'
    const user = new User({ id, providerId, roles: ['customer']})
    const userJsonApi = {
        id,
        attributes: {
            roles: ['customer']
        }
    }
    stubs.request.body = getValidRequestBody(id, token)
    stubs.findUserByTokenQueryHandler.execute = jest.fn().mockResolvedValueOnce(user)
    stubs.jsonApiUserTransformer.transform = jest.fn().mockResolvedValueOnce(userJsonApi)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expectedArguments = {
        data: {
            id: 'user-id',
            attributes: {
                roles: ['customer']
            }
        }
    }
    expect(stubs.reply.send).toHaveBeenCalledTimes(1)
    expect(stubs.reply.send).toHaveBeenCalledWith(expectedArguments)
  })
})
