import { Server } from 'http';
import { Container } from '../container/container';
import { Parameters } from '../parameters/parameters';

export interface FrameworkAdapter {
  boot(container: Container, parameters: Parameters): void
  shutdown(): Promise<void>;
  startServer(port: number, host?: string): Promise<Server>
}
