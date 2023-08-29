import { FastifyReply, FastifyRequest } from 'fastify';

import CreateStoreCommandHandler from '../../../../../src/application/store/command/create-store/create-store-command-handler';
import CreateStoreController from '../../../../../src/infrastructure/store/controller/create-store-controller';
import { User } from '../../../../../src/domain/user/user';
import UserRequestService from '../../../../../src/infrastructure/fastify/user-request-service';

describe('CreateStoreController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest>
    reply: Partial<FastifyReply>
    userRequestService: Partial<UserRequestService>
    createStoreCommandHandler: Partial<CreateStoreCommandHandler>
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
    userRequestService: {
      getUser: jest.fn()
    },
    createStoreCommandHandler: {
      execute: jest.fn()
    }
  }
  const controller = new CreateStoreController(
    stubs.userRequestService as UserRequestService,
    stubs.createStoreCommandHandler as CreateStoreCommandHandler
  )

  function getValidRequestBody(id: string, name: string): any {
    return {
      data: {
        id,
        attributes: {
          name
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
        id: 'store-id'
      }
    },
    { // missing data.attributes.name
      data: {
        id: 'store-id',
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
          name: 'store'
        }
      }
    },
    {
      data: {
        id: false,
        attributes: {
          name: 'store'
        }
      }
    },
    {
      data: {
        id: null,
        attributes: {
          name: 'store'
        }
      }
    },
    // invalid name
    {
      data: {
        id: 'store-id',
        attributes: {
          name: 123
        }
      }
    },
    {
      data: {
        id: 'store-id',
        attributes: {
          name: false
        }
      }
    },
    {
      data: {
        id: 'store-id',
        attributes: {
          name: null
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

  test('Should call userRequestService.getUser times with arguments', async () => {
    // Given
    const id = 'store-id'
    const sellerId = 'seller-id'
    const name = 'store-name'
    const user = new User({ id: sellerId, providerId: 'provider-id', roles: ['customer'] })
    stubs.userRequestService.getUser = jest.fn().mockReturnValueOnce(user)
    stubs.request.body = getValidRequestBody(id, name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = stubs.request
    expect(stubs.userRequestService.getUser).toHaveBeenCalledTimes(1)
    expect(stubs.userRequestService.getUser).toHaveBeenCalledWith(expected)
  })

  test('Should call createStoreCommandHandler.execute times with arguments', async () => {
    // Given
    const id = 'store-id'
    const sellerId = 'seller-id'
    const name = 'store-name'
    const user = new User({ id: sellerId, providerId: 'provider-id', roles: ['customer'] })
    stubs.userRequestService.getUser = jest.fn().mockReturnValueOnce(user)
    stubs.request.body = getValidRequestBody(id, name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = {
      id: 'store-id',
      sellerId: 'seller-id',
      name: 'store-name'
    }
    expect(stubs.createStoreCommandHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.createStoreCommandHandler.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call reply.status times with arguments', async () => {
    // Given
    const id = 'store-id'
    const sellerId = 'seller-id'
    const name = 'store-name'
    const user = new User({ id: sellerId, providerId: 'provider-id', roles: ['customer'] })
    stubs.userRequestService.getUser = jest.fn().mockReturnValueOnce(user)
    stubs.request.body = getValidRequestBody(id, name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = 201
    expect(stubs.reply.status).toHaveBeenCalledTimes(1)
    expect(stubs.reply.status).toHaveBeenCalledWith(expected)
  })

  test('Should call reply.send times with arguments', async () => {
    const id = 'store-id'
    const sellerId = 'seller-id'
    const name = 'store-name'
    const user = new User({ id: sellerId, providerId: 'provider-id', roles: ['customer'] })
    stubs.userRequestService.getUser = jest.fn().mockReturnValueOnce(user)
    stubs.request.body = getValidRequestBody(id, name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    expect(stubs.reply.send).toHaveBeenCalledTimes(1)
    expect(stubs.reply.send).toHaveBeenCalledWith()
  })
})
