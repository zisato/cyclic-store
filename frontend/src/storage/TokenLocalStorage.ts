import { GenericLocalStorage } from './GenericLocalStorage';
import { Token } from '../models/Token';

export class TokenLocalStorage extends GenericLocalStorage {
  static getStorageName(): string {
    return 'store:token'
  }

  static has(): boolean {
    return super.hasItem(this.getStorageName())
  }

  static get(): Token | null {
    return super.getItem(this.getStorageName())
  }

  static set(value: Token): void {
    super.setItem(this.getStorageName(), value)
  }

  static remove(): void {
    super.removeItem(this.getStorageName());
  }
}
