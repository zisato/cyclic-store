import { FastifyReply, FastifyRequest } from 'fastify';
import { InvalidArgumentError } from '../../../../../src/domain/error/invalid-argument-error'
import FastifyErrorHandler from '../../../../../src/infrastructure/fastify/error-handler/fastify-error-handler'

describe('FastifyErrorHandler unit test', () => {
  const stubs: {
    request: FastifyRequest
    reply: FastifyReply
  } = {
    request: {} as FastifyRequest,
    reply: {
      send: jest.fn().mockImplementation(() => {
        return stubs.reply
      }),
      status: jest.fn().mockImplementation(() => {
        return stubs.reply
      })
    } as unknown as FastifyReply,
  }

  test('Should resolver status code from error', () => {
    const errorHandlerMapping = new Map<string, number>([
      [InvalidArgumentError.name, 400]
    ])
    const errorHandler = new FastifyErrorHandler(errorHandlerMapping);
    const error = new InvalidArgumentError();

    errorHandler.handle(error, stubs.request, stubs.reply);

    const expectedStatus = 400;
    expect(stubs.reply.status).toHaveBeenCalledWith(expectedStatus);
  });

  test('Should return default status code when not resolver from error', () => {
    const errorHandler = new FastifyErrorHandler();
    const error = new Error();

    errorHandler.handle(error, stubs.request, stubs.reply);

    const expectedStatus = 500;
    expect(stubs.reply.status).toHaveBeenCalledWith(expectedStatus);
  });
})