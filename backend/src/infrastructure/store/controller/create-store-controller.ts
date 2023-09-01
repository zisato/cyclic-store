import { FastifyReply, FastifyRequest } from 'fastify';

import { CreateStoreCommand } from '../../../application/store/command/create-store/create-store-command';
import CreateStoreCommandHandler from '../../../application/store/command/create-store/create-store-command-handler';
import { CreateStoreDto } from './dto/create-store-dto';
import UserRequestService from '../../fastify/user-request-service';

export default class CreateStoreController {
  constructor(
    private readonly userRequestService: UserRequestService,
    private readonly createStoreCommandHandler: CreateStoreCommandHandler
  ) {}

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const user = this.userRequestService.getUser(request);
    const createStoreDto = new CreateStoreDto(request);

    const command = new CreateStoreCommand(
      createStoreDto.requestBody.data.id,
      user.id,
      createStoreDto.requestBody.data.attributes.name
    );
    await this.createStoreCommandHandler.execute(command);

    reply.status(201).send();
  };
}
