import { ListProductsByStoreQuery } from './list-products-by-store-query';
import { Product } from '../../../../domain/product/product';
import { ProductRepository } from '../../../../domain/product/repository/product-repository';

export default class ListProductsByStoreQueryHandler {
    constructor(private readonly productRepository: ProductRepository) {}

    async execute(query: ListProductsByStoreQuery): Promise<Product[]> {
        return this.productRepository.findByStore(query.storeId);
    }
}