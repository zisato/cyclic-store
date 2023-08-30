import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../src/app'
import { Product } from '../../../src/domain/product/product'
import { ProductRepository } from '../../../src/domain/product/repository/product-repository'
import { UserRepository } from '../../../src/domain/user/repository/user-repository'
import { User } from '../../../src/domain/user/user'
import { StoreRepository } from '../../../src/domain/store/repository/store-repository'
import { Store } from '../../../src/domain/store/store'

describe('Create Product acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const route = '/admin/products'

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

  async function givenExistingSeller(id: string): Promise<void> {
    const userRepository = app.getContainer().get<UserRepository>('userRepository')
    const user = new User({ id, providerId: id, roles: ['seller'] })

    await userRepository.save(user)
  }

  async function givenExistingProduct(id: string, storeId: string): Promise<void> {
    const productRepository = app.getContainer().get<ProductRepository>('productRepository')

    await productRepository.save(new Product({ id, name: 'product-name', storeId }))
  }

  async function givenExistingStore(id: string, sellerId: string): Promise<void> {
    const storeRepository = app.getContainer().get<StoreRepository>('storeRepository')

    await storeRepository.save(new Store({ id, sellerId, name: 'store-name' }))
  }

  test('When valid request returns 201 status code', async () => {
    // Given
    const userId = '54321'
    const productId = '12345'
    const storeId = '11111'
    const productName = 'product-name'
    await givenExistingSeller(userId)
    await givenExistingStore(storeId, userId)
    const requestBody = givenValidRequestBody({ id: productId, name: productName })

    // When
    const response = await request(server).post(route).set('authorization', `Bearer ${userId}`).send(requestBody)

    // Then
    const expectedStatusCode = 201
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When existing product id returns 400 status code', async () => {
    // Given
    const userId = '54321'
    const productId = '12345'
    const storeId = '11111'
    const productName = 'product-name'
    await givenExistingProduct(productId, storeId)
    await givenExistingSeller(userId)
    await givenExistingStore(storeId, userId)
    const requestBody = givenValidRequestBody({ id: productId, name: productName })

    // When
    const response = await request(server).post(route).set('authorization', `Bearer ${userId}`).send(requestBody)

    // Then
    const expectedStatusCode = 400
    expect(response.statusCode).toEqual(expectedStatusCode)
  })
})
