import { Order } from '../../../domain/order/order';

type JsonApiOrderItem = {
  productId: string;
  quantity: number;
};

type JsonApiOrder = {
  id: string;
  attributes: {
    status: string;
    items: JsonApiOrderItem[];
  };
};

export default class JsonApiOrderTransformer {
  async transformArray(orders: Order[]): Promise<JsonApiOrder[]> {
    const result = [];

    for (const order of orders) {
      result.push(await this.transform(order));
    }

    return result;
  }

  async transform(order: Order): Promise<JsonApiOrder> {
    const orderItems = order.items.map((orderItem) => {
      return {
        productId: orderItem.productId,
        quantity: orderItem.quantity
      };
    });

    return {
      id: order.id,
      attributes: {
        status: order.status,
        items: orderItems
      }
    };
  }
}
