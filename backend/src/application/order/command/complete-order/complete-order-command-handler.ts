import { CompleteOrderCommand } from './complete-order-command';
import { InvalidArgumentError } from '../../../../domain/error/invalid-argument-error';
import { Order } from '../../../../domain/order/order';
import { OrderRepository } from '../../../../domain/order/repository/order-repository';

export default class CompleteOrderCommandHandler {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(command: CompleteOrderCommand): Promise<void> {
    let order = await this.orderRepository.get(command.id);
    this.ensureOrderCustomer(order, command.customerId);

    order = order.complete();

    await this.orderRepository.save(order);
  }

  private ensureOrderCustomer(order: Order, customerId: string): void {
    if (order.customerId !== customerId) {
      throw new InvalidArgumentError('Invalid customer order');
    }
  }
}
