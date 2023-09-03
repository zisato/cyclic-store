import { Cart, CartItem } from '../models/Cart';

import { ApiClientOrderRepository } from '../repositories/ApiClientOrderRepository';
import { CartLocalStorage } from '../storage/CartLocalStorage';
import { defineStore } from 'pinia';

interface State {
  cart: Cart;
}

const getCart = (): Cart => {
  const cart = CartLocalStorage.get();
  if (cart === null) {
    return { items: [] };
  }

  return cart;
};

export const useCartStore = defineStore({
  id: 'cart',
  state: (): State => ({
    cart: getCart(),
  }),
  actions: {
    async checkout(): Promise<void> {
      const orderRepository = new ApiClientOrderRepository();
      const order = {
        id: '',
        status: 'pending',
        items: this.cart.items.map((cartItem) => {
          return {
            productId: cartItem.productId,
            quantity: cartItem.quantity
          };
        })
      }
      await orderRepository.create(order)

      CartLocalStorage.remove();

      this.cart = { items: [] }
    },
    addItem(cartItem: CartItem): void {
      const existingItemIndex = this.cart.items.findIndex((i) =>
        i.productId === cartItem.productId
      );

      if (existingItemIndex > -1) {
        const existingItem = this.cart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + cartItem.quantity;

        this.cart.items[existingItemIndex] = { ...cartItem, quantity: newQuantity };
      } else {
        this.cart.items.push(cartItem);
      }

      CartLocalStorage.set(this.cart);
    },
    removeItem(productId: string): void {
      const existingItemIndex = this.cart.items.findIndex((i) =>
        i.productId === productId
      );

      if (existingItemIndex > -1) {
        this.cart.items.splice(existingItemIndex, 1);
      }

      CartLocalStorage.set(this.cart);
    },
    addQuantity(productId: string): void {
      const existingItemIndex = this.cart.items.findIndex((i) =>
        i.productId === productId
      );

      if (existingItemIndex > -1) {
        const existingItem = this.cart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + 1;

        this.cart.items[existingItemIndex] = { ...existingItem, quantity: newQuantity };

        CartLocalStorage.set(this.cart);
      }
    },
    removeQuantity(productId: string): void {
      const existingItemIndex = this.cart.items.findIndex((i) =>
        i.productId === productId
      );

      if (existingItemIndex > -1) {
        const existingItem = this.cart.items[existingItemIndex];
        const newQuantity = existingItem.quantity - 1;

        if (newQuantity > 0) {
          this.cart.items[existingItemIndex] = { ...existingItem, quantity: newQuantity };

          CartLocalStorage.set(this.cart);
        }
      }
    }
  },
});
