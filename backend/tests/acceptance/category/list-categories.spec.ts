import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../src/app'
import { CategoryRepository } from '../../../src/domain/category/repository/category-repository'
import { Category } from '../../../src/domain/category/category'

describe('List Categories acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const route = '/admin/categories'

  async function givenAnExistingCategory(id: string): Promise<void> {
    const categoryRepository = app.getContainer().get<CategoryRepository>('categoryRepository');
    const category = new Category({ id, name: 'category-name' });

    await categoryRepository.save(category);
  }

  beforeAll(async () => {
    app.boot()
    const parameters = app.getParameters()
    server = await app.startServer(parameters.get<number>('server.port'), parameters.get<string | undefined>('server.host'))
  })

  afterAll(async () => {
    await app.shutdown()
    server = null
  })

  test('When valid request returns 200 status code', async () => {
    // When
    const response = await request(server).get(route).send()

    // Then
    const expectedStatusCode = 200
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When valid request returns categories', async () => {
    // Given
    await givenAnExistingCategory('12345');
    await givenAnExistingCategory('54321');

    // When
    const response = await request(server).get(route).send()

    // Then
    const expectedBody = {
      data: [
        {
          id: '12345',
          attributes: {
            name: 'category-name'
          }
        },
        {
          id: '54321',
          attributes: {
            name: 'category-name'
          }
        }
      ]
    }
    expect(response.body).toEqual(expectedBody)
  })
})
