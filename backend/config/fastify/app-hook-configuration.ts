import { Container } from '../../src/shared/kernel/container/container';
import { HookConfiguration, HookHandler } from '../../src/shared/kernel/configuration/fastify/hook-configuration';
import { Parameters } from '../../src/shared/kernel/parameters/parameters';

export class AppHookConfiguration implements HookConfiguration {
  getHooksConfiguration(_container: Container, _parameters: Parameters): HookHandler[] {
    return [];
  }
}
