import { CreateCategoryCommand } from '../../../application/category/command/create-category/create-category-command';
import { FastifyReply, FastifyRequest } from 'fastify';
import UpdateCategoryCommandHandler from '../../../application/category/command/update-category/update-category-command-handler';
import { UpdateCategoryDto } from './dto/update-category-dto';

export default class UpdateCategoryController {
  constructor(private readonly updateCategoryCommandHandler: UpdateCategoryCommandHandler) {}

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const updateCategoryDto = new UpdateCategoryDto(request);

    const command = new CreateCategoryCommand(
      updateCategoryDto.requestParams.categoryId,
      updateCategoryDto.requestBody.data.attributes.name
    );
    await this.updateCategoryCommandHandler.execute(command);

    reply.status(204).send();
  };
}
