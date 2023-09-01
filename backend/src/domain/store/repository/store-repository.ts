import { Store } from '../store';

export interface StoreRepository {
    exists(id: string): Promise<boolean>

    existsBySellerId(sellerId: string): Promise<boolean>

    findAll(): Promise<Store[]>;

    findBySellerId(sellerId: string): Promise<Store | undefined>;

    get(id: string): Promise<Store>;

    save(store: Store): Promise<void>
}