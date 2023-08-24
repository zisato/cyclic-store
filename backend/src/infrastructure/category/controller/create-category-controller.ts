import CreateCategoryCommandHandler from '../../../application/category/command/create-category/create-category-command-handler';
import { CreateCategoryCommand } from '../../../application/category/command/create-category/create-category-command';
import { CreateCategoryDto } from './dto/create-category-dto';
import { FastifyReply, FastifyRequest } from 'fastify';

export default class CreateCategoryController {
  constructor(private readonly createCategoryCommandHandler: CreateCategoryCommandHandler) {}

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const createCategoryDto = new CreateCategoryDto(request);

    const command = new CreateCategoryCommand(
      createCategoryDto.requestBody.data.id,
      createCategoryDto.requestBody.data.attributes.name
    );
    await this.createCategoryCommandHandler.execute(command);

    reply.status(201).send();
  };
}
