import { Product } from '../../../domain/product/product';
import { ProductRepository } from '../../../domain/product/repository/product-repository';
import { ModelNotFoundError } from '../../../domain/error/model-not-found-error';

export default class InMemoryProductRepository implements ProductRepository {
    private readonly data: Product[] = [];

    async exists(id: string): Promise<boolean> {
        return this.data.some((product: Product) => {
            return product.id === id;
        })
    }

    async findByStore(storeId: string): Promise<Product[]> {
        return this.data.filter((product: Product) => {
            return product.storeId === storeId;
        });
    }

    async get(id: string): Promise<Product> {
        const existingProductIndex = this.data.findIndex((product: Product) => {
            return product.id === id;
        });
      
        if (existingProductIndex === -1) {
            throw new ModelNotFoundError(`Product with id ${id} not found`);
        }
      
        return this.data[existingProductIndex];
    }

    async save(product: Product): Promise<void> {
        const existingProductIndex = this.data.findIndex((data: Product) => {
            return product.id === data.id;
        });
      
        if (existingProductIndex >= 0) {
            this.data[existingProductIndex] = product;
        } else {
            this.data.push(product);
        }
    }
}