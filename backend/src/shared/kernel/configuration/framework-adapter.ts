import { Server } from 'http';
import { Container } from '../container/container';
import { Parameters } from '../parameters/parameters';

export interface FrameworkAdapter {
  shutdown(): void;
  boot(container: Container, parameters: Parameters): void
  startServer(port: number, host?: string): Server
}
