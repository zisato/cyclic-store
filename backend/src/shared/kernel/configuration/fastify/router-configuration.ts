import { RouteOptions } from 'fastify';
import { Container } from '../../container/container';

export interface RouteConfiguration {
  getRoutesOption(container: Container): RouteOptions[];
}
