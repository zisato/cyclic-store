import CreateProductCommandHandler from '../../../application/product/command/create-product/create-product-command-handler';
import { CreateProductCommand } from '../../../application/product/command/create-product/create-product-command';
import { CreateProductDto } from './dto/create-product-dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import UserRequestService from '../../fastify/user-request-service';
import GetStoreBySellerQueryHandler from '../../../application/store/query/get-store-by-seller/get-store-by-seller-query-handler';
import { GetStoreBySellerQuery } from '../../../application/store/query/get-store-by-seller/get-store-by-seller-query';

export default class CreateProductController {
  constructor(
    private readonly userRequestService: UserRequestService,
    private readonly getStoreBySellerQueryHandler: GetStoreBySellerQueryHandler,
    private readonly createProductCommandHandler: CreateProductCommandHandler
  ) {}

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const seller = this.userRequestService.getUser(request);

    const query = new GetStoreBySellerQuery(seller.id);
    const store = await this.getStoreBySellerQueryHandler.execute(query);

    const createProductDto = new CreateProductDto(request);

    const command = new CreateProductCommand(
      createProductDto.requestBody.data.id,
      createProductDto.requestBody.data.attributes.name,
      store.id
    );
    await this.createProductCommandHandler.execute(command);

    reply.status(201).send();
  };
}
