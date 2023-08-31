import DetailProductController from '../../../../../src/infrastructure/product/controller/detail-product-controller'
import JsonApiProductTransformer from '../../../../../src/infrastructure/product/transformer/json-api-product-transformer'
import { Product } from '../../../../../src/domain/product/product'
import DetailProductQueryHandler from '../../../../../src/application/product/query/detail-product/detail-product-query-handler'
import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidJsonSchemaError } from '../../../../../src/infrastructure/error/invalid-json-schema-error'

describe('DetailProductController unit test', () => {
    const stubs: {
        request: Partial<FastifyRequest>
        reply: Partial<FastifyReply>
        detailProductQueryHandler: Partial<DetailProductQueryHandler>
        jsonApiProductTransformer: Partial<JsonApiProductTransformer>
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
        detailProductQueryHandler: {
            execute: jest.fn()
        },
        jsonApiProductTransformer: {
            transform: jest.fn()
        }
    }
    const controller = new DetailProductController(stubs.detailProductQueryHandler as DetailProductQueryHandler, stubs.jsonApiProductTransformer as JsonApiProductTransformer)

    test.each([
        // invalid productId
        {
            productId: 123
        },
        {
            productId: false
        },
        {
            productId: null
        },
    ])('Should throw Error when invalid request parameter value %j', async (requestParams) => {
        // Given
        stubs.request.params = requestParams

        // When
        const result = controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

        // Then
        void expect(result).rejects.toThrow(InvalidJsonSchemaError)
    })

    test('Should call detailProductQueryHandler.execute once with arguments', async () => {
        // Given
        const productId = '12345'
        const storeId = '54321'
        const product = new Product({ id: productId, name: 'product', storeId })
        stubs.request.params = { productId: productId }
        stubs.detailProductQueryHandler.execute = jest.fn().mockResolvedValue(product)

        // When
        await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

        // Then
        const expected = { id: '12345' }
        expect(stubs.detailProductQueryHandler.execute).toHaveBeenCalledTimes(1)
        expect(stubs.detailProductQueryHandler.execute).toHaveBeenCalledWith(expected)
    })

    test('Should call jsonApiProductTransformer.transform once with arguments', async () => {
        // Given
        const productId = '12345'
        const storeId = '54321'
        const product = new Product({ id: productId, name: 'product', storeId })
        stubs.request.params = { productId: productId }
        stubs.detailProductQueryHandler.execute = jest.fn().mockResolvedValue(product)

        // When
        await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

        // Then
        const expected = {
            id: productId,
            name: 'product',
            storeId: storeId
        }
        expect(stubs.jsonApiProductTransformer.transform).toHaveBeenCalledTimes(1)
        expect(stubs.jsonApiProductTransformer.transform).toHaveBeenCalledWith(expected)
    })

    test('Should call reply.status method when valid request', async () => {
        // Given
        const productId = '12345'
        const storeId = '54321'
        const product = new Product({ id: productId, name: 'product', storeId })
        stubs.request.params = { productId: productId }
        stubs.detailProductQueryHandler.execute = jest.fn().mockResolvedValue(product)

        // When
        await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

        // Then
        const expectedTimes = 1
        const expectedArguments = 200
        expect(stubs.reply.status).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.reply.status).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call reply.send method when valid request', async () => {
        // Given
        const productId = '12345'
        const storeId = '54321'
        const product = new Product({ id: productId, name: 'product', storeId })
        const jsonApiProduct = {
            id: productId,
            attributes: {
                name: 'product'
            }
        }
        stubs.request.params = { productId: productId }
        stubs.detailProductQueryHandler.execute = jest.fn().mockResolvedValue(product)
        stubs.jsonApiProductTransformer.transform = jest.fn().mockReturnValueOnce(jsonApiProduct)

        // When
        await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

        // Then
        const expectedTimes = 1
        const expectedArguments = [
            {
                data: {
                    id: '12345',
                    attributes: {
                        name: 'product'
                    }
                }
            }
        ]
        expect(stubs.reply.send).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.reply.send).toHaveBeenCalledWith(...expectedArguments)
    })
})
