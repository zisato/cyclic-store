export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  readonly id: string;
  readonly status: string;
  readonly items: OrderItem[];
}
