import { FastifyReply, FastifyRequest } from 'fastify';

export default class StatusController {
    handle = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        return reply.send({ status: 'ok' });
    }
}
