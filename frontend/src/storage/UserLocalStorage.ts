import { GenericLocalStorage } from './GenericLocalStorage';
import { User } from '../models/User';

export class UserLocalStorage extends GenericLocalStorage {
  static getStorageName(): string {
    return 'store:user';
  }

  static has(): boolean {
    return super.hasItem(this.getStorageName())
  }

  static get(): User | null {
    return super.getItem(this.getStorageName())
  }

  static set(value: User): void {
    super.setItem(this.getStorageName(), value)
  }

  static remove(): void {
    super.removeItem(this.getStorageName());
  }
}
