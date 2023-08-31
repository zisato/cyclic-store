import { ModelNotFoundError } from '../../../domain/error/model-not-found-error';
import { Store } from '../../../domain/store/store';
import { StoreRepository } from '../../../domain/store/repository/store-repository';

export default class InMemoryStoreRepository implements StoreRepository {
    private readonly data: Store[] = [];

    async exists(id: string): Promise<boolean> {
        return this.data.some((store: Store) => {
            return store.id === id;
        })
    }

    async existsBySellerId(sellerId: string): Promise<boolean> {
        return this.data.some((store: Store) => {
            return store.sellerId === sellerId;
        })
    }

    async findAll(): Promise<Store[]> {
        return this.data;
    }

    async findBySellerId(sellerId: string): Promise<Store | undefined> {
        return this.data.find((store: Store) => {
            return store.sellerId === sellerId;
        })
    }

    async get(id: string): Promise<Store> {
        const store = this.data.find((store: Store) => {
            return store.id === id;
        })

        if (!store) {
            throw new ModelNotFoundError(`Store with id ${id} not found`);
        }

        return store;
    }

    async save(store: Store): Promise<void> {
        const existingStoreIndex = this.data.findIndex((data: Store) => {
            return store.id === data.id;
        });
      
        if (existingStoreIndex >= 0) {
            this.data[existingStoreIndex] = store;
        } else {
            this.data.push(store);
        }
    }
}