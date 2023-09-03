import { FastifyReply, FastifyRequest } from 'fastify';

import { CompleteOrderCommand } from '../../../application/order/command/complete-order/complete-order-command';
import CompleteOrderCommandHandler from '../../../application/order/command/complete-order/complete-order-command-handler';
import UserRequestService from '../../fastify/user-request-service';
import { CompleteOrderDto } from './dto/complete-order-dto';

export default class CompleteOrderController {
    constructor(
        private readonly userRequestService: UserRequestService,
        private readonly completeOrderCommandHandler: CompleteOrderCommandHandler
    ) { }

    handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const customer = this.userRequestService.getUser(request);
        const completeOrderDto = new CompleteOrderDto(request);

        const command = new CompleteOrderCommand(
            completeOrderDto.requestParams.orderId,
            customer.id
        );
        await this.completeOrderCommandHandler.execute(command);

        reply.status(204).send();
    };
}
