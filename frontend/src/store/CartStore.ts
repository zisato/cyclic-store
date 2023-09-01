import { Cart, CartItem } from '../models/Cart';

import { CartStorage } from '../storage/CartStorage';
import { defineStore } from 'pinia';

interface State {
  cart: Cart;
}

const getCart = (): Cart => {
  const cartStorage = new CartStorage();
  const cart = cartStorage.get();
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
    clear(): void {
      const cartStorage = new CartStorage();
      cartStorage.remove();

      this.cart = { items: [] }
    },
    async addItem(cartItem: CartItem): Promise<void> {
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

      const cartStorage = new CartStorage();
      cartStorage.set(this.cart);
    },
    async removeItem(productId: string): Promise<void> {
      const existingItemIndex = this.cart.items.findIndex((i) =>
        i.productId === productId
      );
  
      if (existingItemIndex > -1) {
        this.cart.items.splice(existingItemIndex, 1);
      }

      const cartStorage = new CartStorage();
      cartStorage.set(this.cart);
    },
  },
});
