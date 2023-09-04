import { AwilixContainer } from './container/awilix-container';
import { AwilixContainer as AwilixContainerBase } from 'awilix';
import { Container } from './container/container';
import { ContainerConfiguration } from './configuration/container-configuration';
import { FrameworkAdapter } from './configuration/framework-adapter';
import { KernelError } from './error/kernel-error';
import { NodeConfigParameters } from './parameters/node-config-parameters';
import { Parameters } from './parameters/parameters';
import { Server } from 'http';
import { createContainer } from 'awilix';

type BeforeServerStart = (container: Container, parameters: Parameters) => Promise<void>

export class Kernel {
  private containerConfiguration: ContainerConfiguration;
  private frameworkAdapter: FrameworkAdapter;
  private beforeServerStart: BeforeServerStart;

  private isKernelBooted: boolean = false;
  private parameters: Parameters | null = null;
  private container: AwilixContainer | null = null;

  constructor({
    frameworkAdapter,
    containerConfiguration,
    beforeServerStart,
  }: {
    frameworkAdapter: FrameworkAdapter;
    containerConfiguration?: ContainerConfiguration,
    beforeServerStart?: BeforeServerStart
  }) {
    this.frameworkAdapter = frameworkAdapter;
    this.containerConfiguration = containerConfiguration ?? {
      configureContainer(
        _container: AwilixContainerBase,
        _parameters: Parameters
      ): void { },
    };
    const nullBeforeServerStart = async (_container: Container, _parameters: Parameters): Promise<void> => {};
    this.beforeServerStart = beforeServerStart ?? nullBeforeServerStart;
  }

  boot(): void {
    if (!this.isKernelBooted) {
      const parameters = new NodeConfigParameters();
      const container = this.loadContainer(parameters);

      this.parameters = parameters;
      this.container = container;
      this.isKernelBooted = true;
    }
  }

  async startServer(port: number, host?: string): Promise<Server> {
    this.boot();
    this.bootFramework();
    await this.runBeforeServerStart();

    return this.frameworkAdapter.startServer(port, host);
  }

  async shutdown(): Promise<void> {
    await this.frameworkAdapter.shutdown();

    this.parameters = null;
    if (this.container !== null) {
      this.container.dispose();
    }
    this.container = null;
    this.isKernelBooted = false;
  }

  getParameters(): Parameters {
    if (this.parameters === null) {
      throw new KernelError('Cannot get parameters from non booted kernel');
    }

    return this.parameters;
  }

  getContainer(): Container {
    if (this.container === null) {
      throw new KernelError('Cannot get container from non booted kernel');
    }

    return this.container;
  }

  private bootFramework(): void {
    const container = this.getContainer();
    const parameters = this.getParameters();

    this.frameworkAdapter.boot(container, parameters);
  }

  private loadContainer(parameters: Parameters): AwilixContainer {
    const container = createContainer();

    this.containerConfiguration.configureContainer(container, parameters);

    return new AwilixContainer(container);
  }

  private async runBeforeServerStart(): Promise<void> {    
    const container = this.getContainer();
    const parameters = this.getParameters();

    await this.beforeServerStart(container, parameters);
  }
}
