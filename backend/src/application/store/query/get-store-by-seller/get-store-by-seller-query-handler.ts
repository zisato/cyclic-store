import { ModelNotFoundError } from '../../../../domain/error/model-not-found-error';
import { StoreRepository } from '../../../../domain/store/repository/store-repository';
import { Store } from '../../../../domain/store/store';
import { GetStoreBySellerQuery } from './get-store-by-seller-query';

export default class GetStoreBySellerQueryHandler {
    constructor(private readonly storeRepository: StoreRepository) { }

    async execute(query: GetStoreBySellerQuery): Promise<Store> {
        const store = await this.storeRepository.findBySellerId(query.sellerId);

        if (!store) {
            throw new ModelNotFoundError(`Store by Seller id ${query.sellerId} not found`);
        }

        return store;
    }
}