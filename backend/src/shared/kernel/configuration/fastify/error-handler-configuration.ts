import { Container } from '../../container/container';
import { Parameters } from '../../parameters/parameters';
import { FastifyReply, FastifyRequest } from 'fastify';

export type ErrorHandler = (error: Error, request: FastifyRequest, reply: FastifyReply) => void;

export interface ErrorHandlerConfiguration {
  getErrorHandlerConfiguration(
    container: Container,
    parameters: Parameters
  ): ErrorHandler | undefined;
}
