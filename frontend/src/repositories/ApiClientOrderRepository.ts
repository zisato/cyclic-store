import { ApiClient } from '../clients/api-client'
import { Order } from '../models/Order'

type JsonApiResponse<T> = {
  data: T
}

type JsonApiOrderItemDto = {
  productId: string;
  quantity: number;
};

type JsonApiOrderDto = {
  id: string
  attributes: {
    status: string;
    items: JsonApiOrderItemDto[];
  }
}

export class ApiClientOrderRepository {
  private readonly apiClient: ApiClient

  constructor() {
    this.apiClient = new ApiClient()
  }

  async create(order: Order): Promise<void> {
    await this.apiClient.post('/orders', {
      data: {
        attributes: {
          items: order.items,
        },
      },
    });
  }

  async complete(orderId: string): Promise<void> {
    await this.apiClient.post(`/admin/orders/${orderId}/complete`);
  }

  async findByCurrentUser(): Promise<Order[]> {
    const response = await this.apiClient.get<JsonApiResponse<JsonApiOrderDto[]>>('/admin/orders')

    return response.body.data.map((orderDto) => {
      const orderItems = orderDto.attributes.items.map((orderItemDto) => {
        return {
          productId: orderItemDto.productId,
          quantity: orderItemDto.quantity
        }
      });

      return {
        id: orderDto.id,
        status: orderDto.attributes.status,
        items: orderItems
      }
    })
  }
}
