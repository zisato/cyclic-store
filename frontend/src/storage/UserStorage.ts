import { AbstractLocalStorage } from './AbstractLocalStorage';
import { User } from '../models/User';

export class UserStorage extends AbstractLocalStorage<User> {
  getStorageName(): string {
    return 'store:user';
  }
}
