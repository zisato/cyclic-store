import { FastifyReply, FastifyRequest } from 'fastify';

import CreateCategoryCommandHandler from '../../../../../src/application/category/command/create-category/create-category-command-handler';
import CreateCategoryController from '../../../../../src/infrastructure/category/controller/create-category-controller';

describe('CreateCategoryController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest>
    reply: Partial<FastifyReply>
    createCategoryCommandHandler: Partial<CreateCategoryCommandHandler>
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
    createCategoryCommandHandler: {
      execute: jest.fn()
    }
  }
  const controller = new CreateCategoryController(stubs.createCategoryCommandHandler as CreateCategoryCommandHandler)

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
        id: 'category-id'
      }
    },
    { // missing data.attributes.name
      data: {
        id: 'category-id',
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
          name: 'category'
        }
      }
    },
    {
      data: {
        id: false,
        attributes: {
          name: 'category'
        }
      }
    },
    {
      data: {
        id: null,
        attributes: {
          name: 'category'
        }
      }
    },
    // invalid name
    {
      data: {
        id: 'category-id',
        attributes: {
          name: 123
        }
      }
    },
    {
      data: {
        id: 'category-id',
        attributes: {
          name: false
        }
      }
    },
    {
      data: {
        id: 'category-id',
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

  test('Should call createCategoryCommandHandler.execute times with arguments', async () => {
    // Given
    const id = 'category-id'
    const name = 'category-name'
    stubs.request.body = getValidRequestBody(id, name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = {
      name: 'category-name'
    }
    expect(stubs.createCategoryCommandHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.createCategoryCommandHandler.execute).toHaveBeenCalledWith(expect.objectContaining(expected))
  })

  test('Should call reply.status times with arguments', async () => {
    // Given
    const id = 'category-id'
    const name = 'category-name'
    stubs.request.body = getValidRequestBody(id, name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = 201
    expect(stubs.reply.status).toHaveBeenCalledTimes(1)
    expect(stubs.reply.status).toHaveBeenCalledWith(expected)
  })

  test('Should call reply.send times with arguments', async () => {
    // Given
    const id = 'category-id'
    const name = 'category-name'
    stubs.request.body = getValidRequestBody(id, name)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    expect(stubs.reply.send).toHaveBeenCalledTimes(1)
    expect(stubs.reply.send).toHaveBeenCalledWith()
  })
})
