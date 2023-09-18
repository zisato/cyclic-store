import { FastifyReply, FastifyRequest } from 'fastify';

export default class ListTablesController {
    handle = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const results: string[] = []
        if (process.env.CYCLIC_DB !== undefined) {
            results.push(process.env.CYCLIC_DB);
        }

        reply.status(200).send({
            data: results
        });
    }
}