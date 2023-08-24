import { FastifyReply, FastifyRequest } from 'fastify';

export default class StatusController {
    handle = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        return reply.status(200).send({ status: 'ok' });
    }
}
