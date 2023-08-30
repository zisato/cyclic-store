import { CreateProductCommand } from './create-product-command';
import { InvalidArgumentError } from '../../../../domain/error/invalid-argument-error';
import { ModelNotFoundError } from '../../../../domain/error/model-not-found-error';
import { Product } from '../../../../domain/product/product';
import { ProductRepository } from '../../../../domain/product/repository/product-repository';
import { StoreRepository } from '../../../../domain/store/repository/store-repository';

export default class CreateProductCommandHandler {
    constructor(private readonly productRepository: ProductRepository, private readonly storeRepository: StoreRepository) {}
  
    async execute(command: CreateProductCommand): Promise<void> {
      await this.ensureProductIdNotExists(command.id);
      await this.ensureStoreIdExists(command.storeId);
  
      const product = new Product({ id: command.id, name: command.name, storeId: command.storeId });
  
      await this.productRepository.save(product);
    }
  
    async ensureProductIdNotExists(id: string): Promise<void> {
      if (await this.productRepository.exists(id)) {
        throw new InvalidArgumentError(`Existing Product with id ${id}`);
      }
    }
  
    async ensureStoreIdExists(id: string): Promise<void> {
      if (!await this.storeRepository.exists(id)) {
        throw new ModelNotFoundError(`Store with id ${id} not found`);
      }
    }
  }
  