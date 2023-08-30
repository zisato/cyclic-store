import { App } from '../../../src/app'
import { Server } from 'http'
import { User } from '../../../src/domain/user/user'
import { UserRepository } from '../../../src/domain/user/repository/user-repository'
import request from 'supertest'

describe('Add Seller Role acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const getRoute = (customerId: string) => { return `/users/${customerId}/roles/seller` }

  beforeAll(async () => {
    app.boot()
    const parameters = app.getParameters()
    server = await app.startServer(parameters.get<number>('server.port'), parameters.get<string | undefined>('server.host'))
  })

  afterAll(async () => {
    await app.shutdown()
    server = null
  })

  async function givenExistingCustomer(id: string): Promise<void> {
    const userRepository = app.getContainer().get<UserRepository>('userRepository')
    const user = new User({ id, providerId: id, roles: ['customer'] })

    await userRepository.save(user)
  }

  test('When not authenticated returns 401 status code', async () => {
    // Given
    const customerId = '12345'
    const route = getRoute(customerId)

    // When
    const response = await request(server).post(route).send()

    // Then
    const expectedStatusCode = 401
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When valid request returns 201 status code', async () => {
    // Given
    const customerId = '12345'
    const route = getRoute(customerId)
    await givenExistingCustomer(customerId)

    // When
    const response = await request(server).post(route).set('authorization', `Bearer ${customerId}`).send()

    // Then
    const expectedStatusCode = 201
    expect(response.statusCode).toEqual(expectedStatusCode)
  })
})
