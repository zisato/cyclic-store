import { AbstractLocalStorage } from './AbstractLocalStorage';
import { Cart } from '../models/Cart';

export class CartStorage extends AbstractLocalStorage<Cart> {
  getStorageName(): string {
    return 'store:cart';
  }
}
