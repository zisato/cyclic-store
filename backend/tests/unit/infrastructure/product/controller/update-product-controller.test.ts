import { FastifyRequest, FastifyReply } from 'fastify'
import UpdateProductController from '../../../../../src/infrastructure/product/controller/update-product-controller'
import { InvalidJsonSchemaError } from '../../../../../src/infrastructure/error/invalid-json-schema-error'
import UpdateProductCommandHandler from '../../../../../src/application/product/command/update-product/update-product-command-handler'

describe('UpdateProductController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest>
    reply: Partial<FastifyReply>
    updateProductCommandHandler: Partial<UpdateProductCommandHandler>,
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
    updateProductCommandHandler: {
      execute: jest.fn()
    },
  }

  const controller = new UpdateProductController(
    stubs.updateProductCommandHandler as UpdateProductCommandHandler
  )

  function getValidRequestBody(name: string): any {
    const result = {
      data: {
        attributes: {
          name: name
        }
      }
    }

    return result
  }

  test.each([
    // invalid name
    {
      data: {
        attributes: {
          name: 123
        }
      }
    },
    {
      data: {
        attributes: {
          name: false
        }
      }
    },
    {
      data: {
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
    void expect(result).rejects.toThrow(InvalidJsonSchemaError)
  })

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
    stubs.request.body = getValidRequestBody('product')

    // When
    const result = controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    void expect(result).rejects.toThrow(InvalidJsonSchemaError)
  })

  test('Should call updateProductCommandHandler.execute once with arguments', async () => {
    // Given
    const name = 'new-product-name'
    const productId = '12345'
    stubs.request.params = { productId: productId }
    stubs.request.body = getValidRequestBody(name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = {
      id: productId,
      name: 'new-product-name'
    }
    expect(stubs.updateProductCommandHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.updateProductCommandHandler.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should call reply.status once with arguments', async () => {
    // Given
    const name = 'new-product-name'
    const productId = '12345'
    stubs.request.params = { productId: productId }
    stubs.request.body = getValidRequestBody(name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expectedTimes = 1
    const expectedArguments = 204
    expect(stubs.reply.status).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.reply.status).toHaveBeenCalledWith(expectedArguments)
  })

  test('Should call reply.send once with arguments', async () => {
    // Given
    const name = 'new-product-name'
    const productId = '12345'
    stubs.request.params = { productId: productId }
    stubs.request.body = getValidRequestBody(name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expectedTimes = 1
    expect(stubs.reply.send).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.reply.send).toHaveBeenCalledWith()
  })
})
