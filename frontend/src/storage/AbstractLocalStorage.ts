export abstract class AbstractLocalStorage<T> {
    abstract getStorageName(): string
  
    has(): boolean {
      return localStorage.getItem(this.getStorageName()) !== null;
    }
  
    get(): T | null {
      if (!this.has()) {
        return null;
      }
  
      const parsedValue = localStorage.getItem(this.getStorageName());
  
      if (parsedValue === null) {
        return null;
      }
  
      return JSON.parse(parsedValue);
    }
  
    set(value: T): void {
      const parsedValue = JSON.stringify(value);
  
      localStorage.setItem(this.getStorageName(), parsedValue);
    }
  
    remove(): void {
      localStorage.removeItem(this.getStorageName());
    }
  }
  