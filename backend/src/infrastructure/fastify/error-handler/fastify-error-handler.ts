import { FastifyReply, FastifyRequest } from 'fastify';

import { ErrorHandler } from '../../../shared/kernel/configuration/fastify/error-handler-configuration';

export default class FastifyErrorHandler {
  private static readonly DEFAULT_ERROR_CODE = 500;

  constructor(
    private readonly errorHandlerMapping: Map<string, number> = new Map<
      string,
      number
    >()
  ) {}

  handle: ErrorHandler = (error: Error, _request: FastifyRequest, reply: FastifyReply): void => {
    this.logError(error);

    const status = this.resolveStatus(error);

    reply.status(status)
    reply.send({ message: error.message });
  };

  private resolveStatus = (error: Error): number => {
    let errorCode = this.errorHandlerMapping.get(error.constructor.name);

    if (errorCode === undefined) {
      errorCode = FastifyErrorHandler.DEFAULT_ERROR_CODE;
    }

    return errorCode;
  };

  private logError(error: Error): void {
    const payload = { trace: error.stack };

    console.error({ payload }, error.message);
  }
}
