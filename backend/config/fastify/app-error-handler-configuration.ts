import { Container } from '../../src/shared/kernel/container/container';
import { ErrorHandler, ErrorHandlerConfiguration } from '../../src/shared/kernel/configuration/fastify/error-handler-configuration';
import { Parameters } from '../../src/shared/kernel/parameters/parameters';
import FastifyErrorHandler from '../../src/infrastructure/fastify/error-handler/fastify-error-handler';

export class AppErrorHandlerConfiguration implements ErrorHandlerConfiguration {
  getErrorHandlerConfiguration(
    container: Container,
    _parameters: Parameters
  ): ErrorHandler | undefined {
    const fastifyErrorHandler = container.getTyped(FastifyErrorHandler);

    return fastifyErrorHandler.handle;
  }
}
