import { Container } from '../../src/shared/kernel/container/container';
import { HookConfiguration, HookHandler } from '../../src/shared/kernel/configuration/fastify/hook-configuration';
import { Parameters } from '../../src/shared/kernel/parameters/parameters';
import PopulateRequestUserProperty from '../../src/infrastructure/fastify/hook/populate-request-user-property';

export class AppHookConfiguration implements HookConfiguration {
  getHooksConfiguration(container: Container, _parameters: Parameters): HookHandler[] {
    const populateRequestUserProperty = container.getTyped(PopulateRequestUserProperty);

    return [
      populateRequestUserProperty
    ];
  }
}
