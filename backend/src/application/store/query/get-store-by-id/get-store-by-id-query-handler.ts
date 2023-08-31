import { GetStoreByIdQuery } from './get-store-by-id-query';
import { Store } from '../../../../domain/store/store';
import { StoreRepository } from '../../../../domain/store/repository/store-repository';

export default class GetStoreByIdQueryHandler {
    constructor(private readonly storeRepository: StoreRepository) { }

    async execute(query: GetStoreByIdQuery): Promise<Store> {
        return this.storeRepository.get(query.id);
    }
}