import { Order } from '../order';

export interface OrderRepository {
    findByStoreId(storeId: string): Promise<Order[]>

    save(order: Order): Promise<void>
}