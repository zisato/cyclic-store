import { FastifyReply, FastifyRequest } from 'fastify';
import IndexController from '../../../../src/infrastructure/controller/index-controller';

describe('IndexController unit test', () => {
  const stubs: {
    request: Partial<FastifyRequest>
    reply: Partial<FastifyReply>
  } = {
    request: {
      body: jest.fn()
    },
    reply: {
      sendFile: jest.fn().mockImplementation(() => {
        return stubs.reply
      }),
      status: jest.fn().mockImplementation(() => {
        return stubs.reply
      })
    }
  }
  const controller = new IndexController()

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
    const expectedArgument = 'index.html'
    expect(stubs.reply.sendFile).toHaveBeenCalledTimes(expectedTimes)
    expect(stubs.reply.sendFile).toHaveBeenCalledWith(expectedArgument)
  })
})
