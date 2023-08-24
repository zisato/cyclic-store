import { FastifyReply, FastifyRequest } from 'fastify';

export default class IndexController {
    handle = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        return reply.status(200).sendFile('index.html');
    }
}
