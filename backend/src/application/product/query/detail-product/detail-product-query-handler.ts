import { DetailProductQuery } from './detail-product-query';
import { Product } from '../../../../domain/product/product';
import { ProductRepository } from '../../../../domain/product/repository/product-repository';

export default class DetailProductQueryHandler {
    constructor(private readonly productRepository: ProductRepository) {}

    async execute(query: DetailProductQuery): Promise<Product> {
        return this.productRepository.get(query.id);
    }
}