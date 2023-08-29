import { Store } from '../store';

export interface StoreRepository {
    exists(id: string): Promise<boolean>

    existsBySellerId(sellerId: string): Promise<boolean>

    save(store: Store): Promise<void>
}