import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../src/app'
import { Product } from '../../../src/domain/product/product'
import { ProductRepository } from '../../../src/domain/product/repository/product-repository'
import { UserRepository } from '../../../src/domain/user/repository/user-repository'
import { User } from '../../../src/domain/user/user'

describe('Detail Product acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const getRoute = (productId: string) => { return `/admin/products/${productId}` }

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
  
  async function givenExistingSeller(id: string): Promise<void> {
    const userRepository = app.getContainer().get<UserRepository>('userRepository')
    const user = new User({ id, providerId: id, roles: ['seller'] })

    await userRepository.save(user)
  }

  async function givenExistingProduct(id: string, storeId: string): Promise<void> {
    const productRepository = app.getContainer().get<ProductRepository>('productRepository')

    await productRepository.save(new Product({ id, name: 'product-name', storeId }))
  }

  test('When not existing product id returns 404 status code', async () => {
    // Given
    const userId = '54321'
    const productId = '12345'
    const route = getRoute(productId)
    await givenExistingSeller(userId)

    // When
    const response = await request(server).get(route).set('authorization', `Bearer ${userId}`).send()

    // Then
    const expectedStatusCode = 404
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When valid request returns 200 status code', async () => {
    // Given
    const userId = '54321'
    const productId = '12345'
    const storeId = '11111'
    const productName = 'product-name'
    const route = getRoute(productId)
    const requestBody = givenValidRequestBody({ name: productName })
    await givenExistingSeller(userId)
    await givenExistingProduct(productId, storeId)

    // When
    const response = await request(server).get(route).set('authorization', `Bearer ${userId}`).send(requestBody)

    // Then
    const expectedStatusCode = 200
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When valid request returns reponse body', async () => {
    // Given
    const userId = '54321'
    const productId = '12345'
    const storeId = '11111'
    const productName = 'product-name'
    const route = getRoute(productId)
    const requestBody = givenValidRequestBody({ name: productName })
    await givenExistingSeller(userId)
    await givenExistingProduct(productId, storeId)

    // When
    const response = await request(server).get(route).set('authorization', `Bearer ${userId}`).send(requestBody)

    // Then
    const expectedBody = {
      data: {
        id: '12345',
        attributes: {
          name: 'product-name'
        }
      }
    }
    expect(response.body).toEqual(expectedBody)
  })
})
