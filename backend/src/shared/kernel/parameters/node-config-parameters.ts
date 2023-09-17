import config, { IConfig } from 'config';

import { KernelError } from '../error/kernel-error';
import { Parameters } from './parameters';

export class NodeConfigParameters implements Parameters {
  private config: IConfig;

  constructor(rootDir: string) {
    const currentConfig = config.util.loadFileConfigs(rootDir);
    const configObject = config.util.cloneDeep(config);
    this.config = config.util.extendDeep(configObject, currentConfig, {
      environment: process.env['NODE_ENV'],
    });
  }

  has(name: string): boolean {
    return this.config.has(name);
  }

  get<T>(name: string): T {
    if (!this.has(name)) {
      throw new KernelError(`Parameter with name ${name} not exists`);
    }

    return this.config.get<T>(name);
  }
}
