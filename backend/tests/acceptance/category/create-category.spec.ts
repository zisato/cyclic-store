import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../src/app'
import { Category } from '../../../src/domain/category/category'
import { CategoryRepository } from '../../../src/domain/category/repository/category-repository'

describe('Create Category acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const route = '/admin/categories'

  beforeAll(async () => {
    app.boot()
    const parameters = app.getParameters()
    server = await app.startServer(parameters.get<number>('server.port'), parameters.get<string | undefined>('server.host'))
  })

  afterAll(async () => {
    await app.shutdown()
    server = null
  })

  function givenValidRequestBody({ id, name }: { id: string; name: string }): any {
    return {
      data: {
        id,
        attributes: {
          name
        }
      }
    }
  }

  async function givenExistingCategory(id: string): Promise<void> {
    const categoryRepository = app.getContainer().get<CategoryRepository>('categoryRepository')

    await categoryRepository.save(new Category({ id, name: 'category-name' }))
  }

  test('When valid request returns 201 status code', async () => {
    // Given
    const categoryId = '12345'
    const categoryName = 'category-name'
    const requestBody = givenValidRequestBody({ id: categoryId, name: categoryName })

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 201
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When existing category id returns 400 status code', async () => {
    // Given
    const categoryId = '12345'
    const categoryName = 'category-name'
    await givenExistingCategory(categoryId)
    const requestBody = givenValidRequestBody({ id: categoryId, name: categoryName })

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 400
    expect(response.statusCode).toEqual(expectedStatusCode)
  })
})
