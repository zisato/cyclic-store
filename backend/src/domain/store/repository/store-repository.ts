import { Store } from '../store';

export interface StoreRepository {
    exists(id: string): Promise<boolean>

    existsBySellerId(sellerId: string): Promise<boolean>

    findBySellerId(sellerId: string): Promise<Store | undefined>;

    save(store: Store): Promise<void>
}