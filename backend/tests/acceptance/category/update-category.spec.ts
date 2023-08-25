import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../src/app'
import { Category } from '../../../src/domain/category/category'
import { CategoryRepository } from '../../../src/domain/category/repository/category-repository'

describe('Update Category acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const getRoute = (categoryId: string) => { return `/admin/categories/${categoryId}` }

  beforeAll(async () => {
    app.boot()
    const parameters = app.getParameters()
    server = await app.startServer(parameters.get<number>('server.port'), parameters.get<string | undefined>('server.host'))
  })

  afterAll(async () => {
    await app.shutdown()
    server = null
  })

  function givenValidRequestBody({ name }: { name: string }): any {
    return {
      data: {
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

  test('When not existing category id returns 404 status code', async () => {
    // Given
    const categoryId = '12345'
    const categoryName = 'category-name'
    const route = getRoute(categoryId)
    const requestBody = givenValidRequestBody({ name: categoryName })

    // When
    const response = await request(server).patch(route).send(requestBody)

    // Then
    const expectedStatusCode = 404
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When valid request returns 204 status code', async () => {
    // Given
    const categoryId = '12345'
    const newCategoryName = 'new-category-name'
    const route = getRoute(categoryId)
    const requestBody = givenValidRequestBody({ name: newCategoryName })
    await givenExistingCategory(categoryId)

    // When
    const response = await request(server).patch(route).send(requestBody)

    // Then
    const expectedStatusCode = 204
    expect(response.statusCode).toEqual(expectedStatusCode)
  })
})
