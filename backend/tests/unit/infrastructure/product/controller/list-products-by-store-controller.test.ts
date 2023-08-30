import { FastifyRequest, FastifyReply } from 'fastify'
import ListProductsByStoreQueryHandler from '../../../../../src/application/product/query/list-products-by-store/list-products-by-store-query-handler'
import ListProductsByStoreController from '../../../../../src/infrastructure/product/controller/list-products-by-store-controller'
import { Product } from '../../../../../src/domain/product/product'
import { User } from '../../../../../src/domain/user/user'
import JsonApiProductTransformer from '../../../../../src/infrastructure/product/transformer/json-api-product-transformer'

describe('ListProductsController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest & { user?: User }>
    reply: Partial<FastifyReply>
    listProductsByStoreQueryHandler: Partial<ListProductsByStoreQueryHandler>,
    jsonApiProductTransformer: Partial<JsonApiProductTransformer>,
  } = {
    request: {
      user: undefined,
      params: {}
    },
    reply: {
        send: jest.fn().mockImplementation(() => {
            return stubs.reply
        }),
        status: jest.fn().mockImplementation(() => {
            return stubs.reply
        })
    },
    listProductsByStoreQueryHandler: {
      execute: jest.fn()
    },
    jsonApiProductTransformer: {
      transformArray: jest.fn()
    }
  }

  const controller = new ListProductsByStoreController(
    stubs.listProductsByStoreQueryHandler as ListProductsByStoreQueryHandler,
    stubs.jsonApiProductTransformer as JsonApiProductTransformer
  )

  test('Should call listProductsByStoreQueryHandler.execute once with arguments', async () => {
    // Given
    const storeId = '12345'
    stubs.request.params = { storeId: storeId }
    stubs.listProductsByStoreQueryHandler.execute = jest.fn().mockResolvedValue([])

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = {
      storeId: storeId
    };
    expect(stubs.listProductsByStoreQueryHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.listProductsByStoreQueryHandler.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call jsonApiProductTransformer.transformArray once with arguments', async () => {
    // Given
    const storeId = '12345'
    const product1Id = '11111'
    const product2Id = '22222'
    const products = [
      new Product({ id: product1Id, name: 'product-1-name', storeId: storeId }),
      new Product({ id: product2Id, name: 'product-2-name', storeId: storeId })
    ]
    stubs.request.params = { storeId: storeId }
    stubs.listProductsByStoreQueryHandler.execute = jest.fn().mockResolvedValue(products)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = [
      {
        id: '11111',
        name: 'product-1-name',
        storeId: '12345'
      },
      {
        id: '22222',
        name: 'product-2-name',
        storeId: '12345'
      }
    ];
    expect(stubs.jsonApiProductTransformer.transformArray).toHaveBeenCalledTimes(1)
    expect(stubs.jsonApiProductTransformer.transformArray).toHaveBeenCalledWith(expected)
  })

  test('Should call reply.status once with arguments', async () => {
    // Given
    const storeId = '12345'
    stubs.request.params = { storeId: storeId }
    stubs.listProductsByStoreQueryHandler.execute = jest.fn().mockResolvedValue([])

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expectedTimes = 1
    const expectedArguments = 200
    expect(stubs.reply.status).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.reply.status).toHaveBeenCalledWith(expectedArguments)
  })

  test('Should call reply.send once with arguments', async () => {
    // Given
    const storeId = '12345'
    const product1Id = '11111'
    const product2Id = '22222'
    const products = [
      new Product({ id: product1Id, name: 'product-1-name', storeId: storeId }),
      new Product({ id: product2Id, name: 'product-2-name', storeId: storeId })
    ]
    stubs.request.params = { storeId: storeId }
    stubs.listProductsByStoreQueryHandler.execute = jest.fn().mockResolvedValue(products)

    const jsonApiProducts = [
      {
        id: product1Id,
        attributes: {
            name: 'product-1-name'
        }
      },
      {
        id: product2Id,
        attributes: {
            name: 'product-2-name'
        }
      }
    ]
    stubs.request.params = { storeId: storeId }
    stubs.listProductsByStoreQueryHandler.execute = jest.fn().mockResolvedValue(products)
    stubs.jsonApiProductTransformer.transformArray = jest.fn().mockReturnValueOnce(jsonApiProducts)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expectedTimes = 1
    const expectedArguments = [
      {
        data: [
          {
            id: '11111',
            attributes: {
              name: 'product-1-name'
            }
          },
          {
            id: '22222',
            attributes: {
              name: 'product-2-name'
            }
          }
        ]
      }
    ]
    expect(stubs.reply.send).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.reply.send).toHaveBeenCalledWith(...expectedArguments)
  })
})
