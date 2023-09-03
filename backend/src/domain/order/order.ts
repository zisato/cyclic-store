import { OrderItem } from './order-item';
import { OrderStatus } from './order-status';
import { v1 } from 'uuid';

export class Order {
    readonly id: string;
    readonly customerId: string;
    readonly storeId: string;
    readonly status: OrderStatus;
    readonly items: OrderItem[];

    constructor({ id, customerId, storeId, status, items }: { id: string; customerId: string; storeId: string; status: OrderStatus; items: OrderItem[] }) {
        this.id = id;
        this.customerId = customerId;
        this.storeId = storeId;
        this.status = status;
        this.items = items;
    }

    static new({ customerId, storeId, items }: { customerId: string; storeId: string; items: OrderItem[] }): Order {
        const id = v1().toString();
        const status = OrderStatus.pending;

        return new Order({
            id,
            customerId,
            storeId,
            status,
            items
        })
    }

    complete(): Order {
        const newStatus = OrderStatus.completed;
    
        return new Order({ ...this, status: newStatus });
      }
}
