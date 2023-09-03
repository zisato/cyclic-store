import { Order } from '../../../domain/order/order';
import { OrderRepository } from '../../../domain/order/repository/order-repository';

export default class InMemoryOrderRepository implements OrderRepository {
    private readonly data: Order[] = [];

    async findByStoreId(storeId: string): Promise<Order[]> {
        return this.data.filter((order: Order) => {
            return order.storeId === storeId;
        });
    }

    async save(order: Order): Promise<void> {
        const existingOrderIndex = this.data.findIndex((data: Order) => {
            return order.id === data.id;
        });
      
        if (existingOrderIndex >= 0) {
            this.data[existingOrderIndex] = order;
        } else {
            this.data.push(order);
        }
    }
}