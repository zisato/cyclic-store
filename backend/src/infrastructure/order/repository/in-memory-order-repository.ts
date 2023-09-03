import { ModelNotFoundError } from '../../../domain/error/model-not-found-error';
import { Order } from '../../../domain/order/order';
import { OrderRepository } from '../../../domain/order/repository/order-repository';

export default class InMemoryOrderRepository implements OrderRepository {
    private readonly data: Order[] = [];

    async findByStoreId(storeId: string): Promise<Order[]> {
        return this.data.filter((order: Order) => {
            return order.storeId === storeId;
        });
    }

    async get(id: string): Promise<Order> {
        const existingOrderIndex = this.data.findIndex((order: Order) => {
            return order.id === id;
        });
      
        if (existingOrderIndex === -1) {
            throw new ModelNotFoundError(`Order with id ${id} not found`);
        }
      
        return this.data[existingOrderIndex];
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