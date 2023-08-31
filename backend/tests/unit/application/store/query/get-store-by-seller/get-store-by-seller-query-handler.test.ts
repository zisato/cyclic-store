import { GetStoreBySellerQuery } from '../../../../../../src/application/store/query/get-store-by-seller/get-store-by-seller-query'
import GetStoreBySellerQueryHandler from '../../../../../../src/application/store/query/get-store-by-seller/get-store-by-seller-query-handler'
import { InterfaceMock } from '../../../../../helpers/interface-mock'
import { StoreRepository } from '../../../../../../src/domain/store/repository/store-repository'
import { Store } from '../../../../../../src/domain/store/store'
import { ModelNotFoundError } from '../../../../../../src/domain/error/model-not-found-error'

describe('GetStoreBySellerQueryHandler unit test suite', () => {
    const stubs = {
        storeRepository: {
            findBySellerId: jest.fn()
        } as InterfaceMock<StoreRepository>
    }
    const getStoreBySeller = new GetStoreBySellerQueryHandler(stubs.storeRepository)

    test('Should call storeRepository.findBySellerId once with arguments', async () => {
        const id = '12345'
        const sellerId = '54321'
        const name = 'store-name'
        const store = new Store({ id, sellerId, name })
        stubs.storeRepository.findBySellerId.mockResolvedValueOnce(store)

        const query = new GetStoreBySellerQuery(sellerId)
        await getStoreBySeller.execute(query)

        const expectedTimes = 1
        const expectedArguments = '54321'
        expect(stubs.storeRepository.findBySellerId).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.findBySellerId).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error store by seller id not exits', async () => {
        const sellerId = '54321'
        stubs.storeRepository.findBySellerId.mockResolvedValueOnce(undefined)

        const query = new GetStoreBySellerQuery(sellerId)
        const promise = getStoreBySeller.execute(query)

        const expectedError = new ModelNotFoundError(`Store by Seller id 54321 not found`)
        await expect(promise).rejects.toThrowError(expectedError)
    })
})
