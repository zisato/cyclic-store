import { FastifyReply, FastifyRequest } from 'fastify';
import StatusController from '../../../../src/infrastructure/controller/status-controller';

describe('StatusController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest>
    reply: Partial<FastifyReply>
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
    }
  }
  const controller = new StatusController()

  test('Should call reply.status times with arguments', async () => {
    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expectedTimes = 1
    const expected = 200
    expect(stubs.reply.status).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.reply.status).toHaveBeenCalledWith(expected)
  })

  test('Should call reply.sendFile times with arguments', async () => {
    // When
    await controller.handle(stubs.request as FastifyRequest, stubs.reply as FastifyReply)

    // Then
    const expectedTimes = 1
    const expectedArgument = { status: 'ok' }
    expect(stubs.reply.send).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.reply.send).toHaveBeenCalledWith(expectedArgument)
  })
})
