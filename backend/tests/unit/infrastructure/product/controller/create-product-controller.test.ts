import { FastifyReply, FastifyRequest } from 'fastify';

import CreateProductCommandHandler from '../../../../../src/application/product/command/create-product/create-product-command-handler';
import CreateProductController from '../../../../../src/infrastructure/product/controller/create-product-controller';
import GetStoreBySellerQueryHandler from '../../../../../src/application/store/query/get-store-by-seller/get-store-by-seller-query-handler';
import UserRequestService from '../../../../../src/infrastructure/fastify/user-request-service';
import { User } from '../../../../../src/domain/user/user';
import { Store } from '../../../../../src/domain/store/store';

describe('CreateProductController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest>
    reply: Partial<FastifyReply>
    userRequestService: Partial<UserRequestService>
    getStoreBySellerQueryHandler: Partial<GetStoreBySellerQueryHandler>
    createProductCommandHandler: Partial<CreateProductCommandHandler>
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
    getStoreBySellerQueryHandler: {
      execute: jest.fn()
    },
    createProductCommandHandler: {
      execute: jest.fn()
    }
  }
  const controller = new CreateProductController(
    stubs.userRequestService as UserRequestService,
    stubs.getStoreBySellerQueryHandler as GetStoreBySellerQueryHandler,
    stubs.createProductCommandHandler as CreateProductCommandHandler
  )

  function getValidRequestBody (id: string, name: string): any {
    return {
      data: {
        id,
        attributes: {
          name: name
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
        id: '12345'
      }
    },
    { // missing data.attributes.name
      data: {
        id: '12345',
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
          name: 'product'
        }
      }
    },
    {
      data: {
        id: false,
        attributes: {
          name: 'product'
        }
      }
    },
    {
      data: {
        id: null,
        attributes: {
          name: 'product'
        }
      }
    },
    // invalid name
    {
      data: {
        id: '12345',
        attributes: {
          name: 123
        }
      }
    },
    {
      data: {
        id: '12345',
        attributes: {
          name: false
        }
      }
    },
    {
      data: {
        id: '12345',
        attributes: {
          name: null
        }
      }
    }
  ])('Should throw Error when invalid request body value %j', async (requestBody) => {
    // Given
    stubs.request.body = requestBody

    // When
    const result = controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    void expect(result).rejects.toThrow(Error)
  })

  test('Should call userRequestService.getUser times with arguments', async () => {
    // Given
    const id = '12345'
    const name = 'product-name'
    const user = new User({ id: '54321', providerId: 'provider-id', roles: ['seller'] })
    const store = new Store({ id: '11111', sellerId: user.id, name: 'store' })
    stubs.request.body = getValidRequestBody(id, name)
    stubs.userRequestService.getUser = jest.fn().mockReturnValueOnce(user)
    stubs.getStoreBySellerQueryHandler.execute = jest.fn().mockResolvedValueOnce(store)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = stubs.request
    expect(stubs.userRequestService.getUser).toHaveBeenCalledTimes(1)
    expect(stubs.userRequestService.getUser).toHaveBeenCalledWith(expected)
  })

  test('Should call getStoreBySellerQueryHandler.execute times with arguments', async () => {
    // Given
    const id = '12345'
    const name = 'product-name'
    const user = new User({ id: '54321', providerId: 'provider-id', roles: ['seller'] })
    const store = new Store({ id: '11111', sellerId: user.id, name: 'store' })
    stubs.request.body = getValidRequestBody(id, name)
    stubs.userRequestService.getUser = jest.fn().mockReturnValueOnce(user)
    stubs.getStoreBySellerQueryHandler.execute = jest.fn().mockResolvedValueOnce(store)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = { sellerId: '54321' }
    expect(stubs.getStoreBySellerQueryHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.getStoreBySellerQueryHandler.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call createProductCommandHandler.execute times with arguments', async () => {
    // Given
    const id = '12345'
    const name = 'product-name'
    const user = new User({ id: '54321', providerId: 'provider-id', roles: ['seller'] })
    const store = new Store({ id: '11111', sellerId: user.id, name: 'store' })
    stubs.request.body = getValidRequestBody(id, name)
    stubs.userRequestService.getUser = jest.fn().mockReturnValueOnce(user)
    stubs.getStoreBySellerQueryHandler.execute = jest.fn().mockResolvedValueOnce(store)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = {
      id: '12345',
      name: 'product-name',
      storeId: '11111'
    }
    expect(stubs.createProductCommandHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.createProductCommandHandler.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })


  test('Should call reply.status times with arguments', async () => {
    // Given
    const id = '12345'
    const name = 'product-name'
    const user = new User({ id: '54321', providerId: 'provider-id', roles: ['seller'] })
    const store = new Store({ id: '11111', sellerId: user.id, name: 'store' })
    stubs.request.body = getValidRequestBody(id, name)
    stubs.userRequestService.getUser = jest.fn().mockReturnValueOnce(user)
    stubs.getStoreBySellerQueryHandler.execute = jest.fn().mockResolvedValueOnce(store)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = 201
    expect(stubs.reply.status).toHaveBeenCalledTimes(1)
    expect(stubs.reply.status).toHaveBeenCalledWith(expected)
  })

  test('Should call reply.send times with arguments', async () => {
    // Given
    const id = '12345'
    const name = 'product-name'
    const user = new User({ id: '54321', providerId: 'provider-id', roles: ['seller'] })
    const store = new Store({ id: '11111', sellerId: user.id, name: 'store' })
    stubs.request.body = getValidRequestBody(id, name)
    stubs.userRequestService.getUser = jest.fn().mockReturnValueOnce(user)
    stubs.getStoreBySellerQueryHandler.execute = jest.fn().mockResolvedValueOnce(store)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    expect(stubs.reply.send).toHaveBeenCalledTimes(1)
    expect(stubs.reply.send).toHaveBeenCalledWith()
  })
})
