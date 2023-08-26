import { Server } from 'http'
import request from 'supertest'
import { App } from '../../../src/app'

describe('Login Callback acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const route = '/login/callback'

  beforeAll(async () => {
    app.boot()
    const parameters = app.getParameters()
    server = await app.startServer(parameters.get<number>('server.port'), parameters.get<string | undefined>('server.host'))
  })

  afterAll(async () => {
    await app.shutdown()
    server = null
  })

  function givenValidRequestBody({ id, token }: { id: string; token: string }): any {
    return {
      data: {
        id,
        attributes: {
          token
        }
      }
    }
  }

  test('When valid request returns 200 status code', async () => {
    // Given
    const userId = '12345'
    const token = 'awesome-token'
    const requestBody = givenValidRequestBody({ id: userId, token })

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedStatusCode = 200
    expect(response.statusCode).toEqual(expectedStatusCode)
  })

  test('When valid request returns user', async () => {
    // Given
    const userId = '12345'
    const token = 'awesome-token'
    const requestBody = givenValidRequestBody({ id: userId, token })

    // When
    const response = await request(server).post(route).send(requestBody)

    // Then
    const expectedResponseBody = {
      data: {
        id: '12345',
        attributes: {
          roles: ['customer']
        }
      }
    }
    expect(response.body).toEqual(expectedResponseBody)
  })
})
