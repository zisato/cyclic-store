import { User } from '../../src/domain/user/user';

declare module 'fastify' {
    export interface FastifyRequest {
        user?: User
    }
}