import { FastifyRequest, FastifyReply } from 'fastify';

import { ErrorHandler } from '../../../shared/kernel/configuration/fastify/error-handler-configuration';

export default class FastifyErrorHandler {
  private static readonly DEFAULT_ERROR_CODE = 500;

  constructor(
    private readonly errorHandlerMapping: Map<string, number> = new Map<
      string,
      number
    >()
  ) {}

  handle: ErrorHandler = async (error: Error, _request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const status = this.resolveStatus(error);
    // const payload = { trace: error.stack };
    // this.logger.error({ payload }, error.message);

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
}
