import { Container } from '../../src/shared/kernel/container/container';
import { ErrorHandler, ErrorHandlerConfiguration } from '../../src/shared/kernel/configuration/fastify/error-handler-configuration';
import { Parameters } from '../../src/shared/kernel/parameters/parameters';

export class AppErrorHandlerConfiguration implements ErrorHandlerConfiguration {
  getErrorHandlerConfiguration(
    _container: Container,
    _parameters: Parameters
  ): ErrorHandler | undefined {
    return undefined
  }
}
