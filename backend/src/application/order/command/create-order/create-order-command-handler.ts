import { CreateOrderCommand } from './create-order-command';
import { Order } from '../../../../domain/order/order';
import { OrderItem } from '../../../../domain/order/order-item';
import { OrderRepository } from '../../../../domain/order/repository/order-repository';
import { ProductRepository } from '../../../../domain/product/repository/product-repository';

export default class CreateOrderCommandHandler {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly productRepository: ProductRepository
    ) { }

    async execute(command: CreateOrderCommand): Promise<void> {
        const orderItemsByStoreId = await this.orderItemsByStoreId(command.items);
        const storeIds = orderItemsByStoreId.keys();

        for (const storeId of storeIds) {
            const items = orderItemsByStoreId.get(storeId);
            if (!items) {
                continue;
            }

            const order = Order.new({
                customerId: command.customerId,
                storeId,
                items,
            });

            await this.orderRepository.save(order);
        }
    }

    private async orderItemsByStoreId(
      orderItems: OrderItem[]
    ): Promise<Map<string, OrderItem[]>> {
      const result: Map<string, OrderItem[]> = new Map<string, OrderItem[]>();
  
      for (const orderItem of orderItems) {
        const product = await this.productRepository.get(orderItem.productId);
        const storeId = product.storeId;
  
        const storeOrderItems = result.get(storeId) ?? [];
        storeOrderItems.push(orderItem);
  
        result.set(storeId, storeOrderItems);
      }
  
      return result;
    }
}
