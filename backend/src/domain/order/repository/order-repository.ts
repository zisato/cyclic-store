import { Order } from '../order';

export interface OrderRepository {
    findByStoreId(storeId: string): Promise<Order[]>

    get(id: string): Promise<Order>

    save(order: Order): Promise<void>
}