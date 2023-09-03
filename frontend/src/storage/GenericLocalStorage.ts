export class GenericLocalStorage {
  static hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  static getItem<T>(key: string): T | null {
    if (!this.hasItem(key)) {
      return null;
    }

    const parsedValue = localStorage.getItem(key);

    if (parsedValue === null) {
      return null;
    }

    return JSON.parse(parsedValue);
  }

  static setItem<T>(key: string, value: T): void {
    const parsedValue = JSON.stringify(value);

    localStorage.setItem(key, parsedValue);
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
