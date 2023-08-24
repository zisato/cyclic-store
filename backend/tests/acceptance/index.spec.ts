
import { Server } from 'http'
import request from 'supertest'
import { App } from '../../src/app'

describe('Index acceptance test', () => {
  let server: Server | null = null
  const app = new App()
  const route = '/'

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
    expect(response.statusCode).toEqual(200)
  })

  test('When valid request returns response body', async () => {
    // When
    const response = await request(server).get(route).send()

    // Then
    const expectedResponseBody = 'HELLO BACKEND'
    expect(response.text).toContain(expectedResponseBody)
  })
})
