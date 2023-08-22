import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { Container } from '../../container/container';
import { Parameters } from '../../parameters/parameters';

export interface HookHandler {
  name: string
  callback: (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => Promise<void>
}

export interface HookConfiguration {
  getHooksConfiguration(container: Container, parameters: Parameters): HookHandler[];
}
