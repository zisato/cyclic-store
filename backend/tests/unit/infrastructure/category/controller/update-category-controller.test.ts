import { FastifyReply, FastifyRequest } from 'fastify';
import UpdateCategoryCommandHandler from '../../../../../src/application/category/command/update-category/update-category-command-handler';
import UpdateCategoryController from '../../../../../src/infrastructure/category/controller/update-category-controller';

describe('UpdateCategoryController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest>
    reply: Partial<FastifyReply>
    updateCategoryCommandHandler: Partial<UpdateCategoryCommandHandler>
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
    updateCategoryCommandHandler: {
      execute: jest.fn()
    }
  }
  const controller = new UpdateCategoryController(stubs.updateCategoryCommandHandler as UpdateCategoryCommandHandler)

  function getValidRequestBody (name: string): any {
    return {
      data: {
        attributes: {
          name: name
        }
      }
    }
  }

  test.each([
    // missing categoryId
    {}
  ])('Should throw Error when missing request parameter %j', async (requestParams) => {
    // Given
    stubs.request.params = requestParams

    // When
    const result = controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    void expect(result).rejects.toThrow(Error)
  })

  test.each([
    // invalid categoryId
    {
      categoryId: 123
    },
    {
      categoryId: false
    },
    {
      categoryId: null
    }
  ])('Should throw Error when invalid request parameter value %j', async (requestParams) => {
    // Given
    stubs.request.params = requestParams

    // When
    const result = controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    void expect(result).rejects.toThrow(Error)
  })

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
    void expect(result).rejects.toThrow(Error)
  })

  test('Should call updateCategoryCommandHandler.execute times with arguments', async () => {
    // Given
    const id = '12345'
    const name = 'category-name'
    stubs.request.params = { categoryId: id }
    stubs.request.body = getValidRequestBody(name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = {
      id: '12345',
      name: 'category-name'
    }
    expect(stubs.updateCategoryCommandHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.updateCategoryCommandHandler.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should call reply.status times with arguments', async () => {
    // Given
    const id = '12345'
    const name = 'category-name'
    stubs.request.params = { categoryId: id }
    stubs.request.body = getValidRequestBody(name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = 204
    expect(stubs.reply.status).toHaveBeenCalledTimes(1)
    expect(stubs.reply.status).toHaveBeenCalledWith(expected)
  })

  test('Should call reply.send times with arguments', async () => {
    // Given
    const id = '12345'
    const name = 'category-name'
    stubs.request.params = { categoryId: id }
    stubs.request.body = getValidRequestBody(name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    expect(stubs.reply.send).toHaveBeenCalledTimes(1)
    expect(stubs.reply.send).toHaveBeenCalledWith()
  })
})
