import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateOrderCommand } from '../../../application/order/command/create-order/create-order-command';
import CreateOrderCommandHandler from '../../../application/order/command/create-order/create-order-command-handler';
import { CreateOrderDto } from './dto/create-order-dto';
import UserRequestService from '../../fastify/user-request-service';

export default class CreateOrderController {
    constructor(
        private readonly userRequestService: UserRequestService,
        private readonly createOrderCommandHandler: CreateOrderCommandHandler
    ) { }

    handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const customer = this.userRequestService.getUser(request);
        const createOrderDto = new CreateOrderDto(request);

        const command = new CreateOrderCommand(
            customer.id,
            createOrderDto.requestBody.data.attributes.items
        );
        await this.createOrderCommandHandler.execute(command);

        reply.status(201).send();
    };
}
