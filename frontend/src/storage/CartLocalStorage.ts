import { Cart } from '../models/Cart';
import { GenericLocalStorage } from './GenericLocalStorage'

export class CartLocalStorage extends GenericLocalStorage {
  static getStorageName(): string {
    return 'store:cart'
  }

  static has(): boolean {
    return super.hasItem(this.getStorageName())
  }

  static get(): Cart | null {
    return super.getItem(this.getStorageName())
  }

  static set(value: Cart): void {
    super.setItem(this.getStorageName(), value)
  }

  static remove(): void {
    super.removeItem(this.getStorageName());
  }
}
