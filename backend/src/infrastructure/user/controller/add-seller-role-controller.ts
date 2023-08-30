import { FastifyReply, FastifyRequest } from 'fastify';

import { AddSellerRoleCommand } from '../../../application/user/command/add-seller-role/add-seller-role-command';
import AddSellerRoleCommandHandler from '../../../application/user/command/add-seller-role/add-seller-role-command-handler';
import { AddSellerRoleDto } from './dto/add-seller-role-dto';

export default class AddSellerRoleController {
    constructor(
        private readonly addSellerRoleCommandHandler: AddSellerRoleCommandHandler
    ) {}

    handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const addSellerRoleDto = new AddSellerRoleDto(request);

        const command = new AddSellerRoleCommand(addSellerRoleDto.requestParams.customerId);
        await this.addSellerRoleCommandHandler.execute(command);

        return reply.status(201).send();
    }
}
