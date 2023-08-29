import { App } from '../../../src/app'
import { Server } from 'http'
import { Store } from '../../../src/domain/store/store'
import { StoreRepository } from '../../../src/domain/store/repository/store-repository'
import { User } from '../../../src/domain/user/user'
import { UserRepository } from '../../../src/domain/user/repository/user-repository'
import request from 'supertest'

describe('Create Store acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const route = '/admin/stores'

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

  async function givenExistingStore(id: string, sellerId: string): Promise<void> {
    const storeRepository = app.getContainer().get<StoreRepository>('storeRepository')

    await storeRepository.save(new Store({ id, sellerId, name: 'store-name' }))
  }

  test('When not authenticated returns 401 status code', async () => {
    // Given
    const storeId = '12345'
    const storeName = 'store-name'
    const requestBody = givenValidRequestBody({ id: storeId, name: storeName })

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 401
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When valid request returns 201 status code', async () => {
    // Given
    const userId = '54321'
    const storeId = '12345'
    const storeName = 'store-name'
    await givenExistingSeller(userId)
    const requestBody = givenValidRequestBody({ id: storeId, name: storeName })

    // When
    const response = await request(server).post(route).set('authorization', `Bearer ${userId}`).send(requestBody)

    // Then
    const expectedStatusCode = 201
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When existing store id returns 400 status code', async () => {
    // Given
    const userId = '54321'
    const storeId = '12345'
    const sellerId = '67890'
    const storeName = 'store-name'
    await givenExistingSeller(userId)
    await givenExistingStore(storeId, sellerId)
    const requestBody = givenValidRequestBody({ id: storeId, name: storeName })

    // When
    const response = await request(server).post(route).set('authorization', `Bearer ${userId}`).send(requestBody)

    // Then
    const expectedStatusCode = 400
    expect(response.statusCode).toEqual(expectedStatusCode)
  })
})
