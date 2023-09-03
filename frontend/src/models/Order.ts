export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  readonly status: string;
  readonly items: OrderItem[];
}
