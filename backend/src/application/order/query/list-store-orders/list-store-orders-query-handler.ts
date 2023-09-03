import { ListStoreOrdersQuery } from './list-store-orders-query';
import { Order } from '../../../../domain/order/order';
import { OrderRepository } from '../../../../domain/order/repository/order-repository';

export default class ListStoreOrdersQueryHandler {
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute(query: ListStoreOrdersQuery): Promise<Order[]> {
        return this.orderRepository.findByStoreId(query.storeId);
    }
}