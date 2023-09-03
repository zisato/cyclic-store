import { OrderItem } from '../../../../domain/order/order-item';

type RawOrderItem = {
    productId: string;
    quantity: number;
};

export class CreateOrderCommand {
    readonly items: OrderItem[];

    constructor(public readonly customerId: string, items: RawOrderItem[]) {
        this.items = items.map((rawOrderItem: RawOrderItem) => {
            return new OrderItem({
                productId: rawOrderItem.productId,
                quantity: rawOrderItem.quantity,
            });
        });
    }
}
