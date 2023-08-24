import { FastifyReply, FastifyRequest } from 'fastify';
import ListCategoriesQueryHandler from '../../../../../src/application/category/query/list-categories/list-categories-query-handler'
import { ListCategoriesQuery } from '../../../../../src/application/category/query/list-categories/list-categories-query'
import ListCategoriesController from '../../../../../src/infrastructure/category/controller/list-categories-controller'
import { Category } from '../../../../../src/domain/category/category'
import JsonApiCategoryTransformer from '../../../../../src/infrastructure/category/transformer/json-api-category-transformer'

describe('ListCategoriesController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest>
    reply: Partial<FastifyReply>
    listCategoriesQueryHandler: Partial<ListCategoriesQueryHandler>
    jsonApiCategoryTransformer: Partial<JsonApiCategoryTransformer>
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
    listCategoriesQueryHandler: {
      execute: jest.fn()
    },
    jsonApiCategoryTransformer: {
      transformArray: jest.fn()
    }
  }
  const controller = new ListCategoriesController(
    stubs.listCategoriesQueryHandler as ListCategoriesQueryHandler,
    stubs.jsonApiCategoryTransformer as JsonApiCategoryTransformer
  )

  test('Should call listCategories.execute method when valid request body', async () => {
    // Given
    stubs.listCategoriesQueryHandler.execute = jest.fn().mockResolvedValue([])

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = new ListCategoriesQuery()
    expect(stubs.listCategoriesQueryHandler.execute).toHaveBeenCalledTimes(1)
    expect(stubs.listCategoriesQueryHandler.execute).toHaveBeenCalledWith(expected)
  })

  test('Should call jsonApiCategoryTransformer.transformArray method when valid request', async () => {
    // Given
    const category1Id = '12345'
    const category2Id = '54321'
    const categories = [
      new Category({ id: category1Id, name: 'category-1-name' }),
      new Category({ id: category2Id, name: 'category-2-name' })
    ]
    stubs.listCategoriesQueryHandler.execute = jest.fn().mockResolvedValueOnce(categories)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expected = [
      {
        id: '12345',
        name: 'category-1-name'
      },
      {
        id: '54321',
        name: 'category-2-name'
      }
    ]
    expect(stubs.jsonApiCategoryTransformer.transformArray).toHaveBeenCalledTimes(1)
    expect(stubs.jsonApiCategoryTransformer.transformArray).toHaveBeenCalledWith(expected)
  })

  test('Should call reply.status method when valid request', async () => {
    // Given
    stubs.listCategoriesQueryHandler.execute = jest.fn().mockResolvedValue([])

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
    const categoryId = '12345'
    const categories = [
      new Category({ id: categoryId, name: 'category-name'})
    ]
    const jsonApiCategories = [
      {
        id: '12345',
        attributes: {
          name: 'category-name'
        }
      }
    ]
    stubs.listCategoriesQueryHandler.execute = jest.fn().mockResolvedValue(categories)
    stubs.jsonApiCategoryTransformer.transformArray = jest.fn().mockReturnValueOnce(jsonApiCategories)

    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expectedTimes = 1
    const expectedArguments = [
      {
        data: [
          {
            id: '12345',
            attributes: {
                name: 'category-name'
            }
          }
        ]
      }
    ]
    expect(stubs.reply.send).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.reply.send).toHaveBeenCalledWith(...expectedArguments)
  })
})
