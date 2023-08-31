import { UpdateProductCommand } from '../../../application/product/command/update-product/update-product-command';
import UpdateProductCommandHandler from '../../../application/product/command/update-product/update-product-command-handler';
import { UpdateProductDto } from './dto/update-product-dto';
import { FastifyReply, FastifyRequest } from 'fastify';

export default class UpdateProductController {
    constructor(private readonly updateProductCommandHandler: UpdateProductCommandHandler) { }

    handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const updateProductDto = new UpdateProductDto(request);

        const command = new UpdateProductCommand(
            updateProductDto.requestParams.productId,
            updateProductDto.requestBody.data?.attributes?.name
        );
        await this.updateProductCommandHandler.execute(command);

        reply.status(204).send();
    };
}
