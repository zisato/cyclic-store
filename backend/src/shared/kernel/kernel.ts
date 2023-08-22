import { AwilixContainer } from './container/awilix-container';
import { AwilixContainer as AwilixContainerBase } from 'awilix';
import { Container } from './container/container';
import { ContainerConfiguration } from './configuration/container-configuration';
import { KernelError } from './error/kernel-error';
import { NodeConfigParameters } from './parameters/node-config-parameters';
import { Parameters } from './parameters/parameters';
import { Server } from 'http';
import { createContainer } from 'awilix';
import { FrameworkAdapter } from './configuration/framework-adapter';

export class Kernel {
  private containerConfiguration: ContainerConfiguration;
  private frameworkAdapter: FrameworkAdapter;

  private isKernelBooted: boolean = false;
  private parameters: Parameters | null = null;
  private container: AwilixContainer | null = null;

  constructor({
    frameworkAdapter,
    containerConfiguration
  }: {
    frameworkAdapter: FrameworkAdapter;
    containerConfiguration?: ContainerConfiguration
  }) {
    this.frameworkAdapter = frameworkAdapter;
    this.containerConfiguration = containerConfiguration ?? {
      configureContainer(
        _container: AwilixContainerBase,
        _parameters: Parameters
      ): void { },
    };
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

  startServer(port: number, host?: string): Server {
    this.boot();
    this.bootFramework();

    return this.frameworkAdapter.startServer(port, host);
  }

  shutdown(): void {
    this.frameworkAdapter.shutdown();

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
}
