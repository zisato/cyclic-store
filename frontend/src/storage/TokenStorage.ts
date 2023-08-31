import { AbstractLocalStorage } from './AbstractLocalStorage';
import { Token } from '../models/Token';

export class TokenStorage extends AbstractLocalStorage<Token> {
  getStorageName(): string {
    return 'store:token';
  }
}
