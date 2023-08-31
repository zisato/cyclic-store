import { Product } from '../product'

export interface ProductRepository {
    exists(id: string): Promise<boolean>

    findByStore(storeId: string): Promise<Product[]>

    get(id: string): Promise<Product>

    save(product: Product): Promise<void>
}
