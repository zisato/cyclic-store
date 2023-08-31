import { ListStoresQuery } from './list-stores-query';
import { Store } from '../../../../domain/store/store';
import { StoreRepository } from '../../../../domain/store/repository/store-repository';

export default class ListStoresQueryHandler {
    constructor(private readonly storeRepository: StoreRepository) {}

    async execute(_query: ListStoresQuery): Promise<Store[]> {
        return this.storeRepository.findAll();
    }
}