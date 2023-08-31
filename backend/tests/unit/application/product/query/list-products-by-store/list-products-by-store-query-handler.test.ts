import { InterfaceMock } from '../../../../../helpers/interface-mock'
import { ListProductsByStoreQuery } from '../../../../../../src/application/product/query/list-products-by-store/list-products-by-store-query'
import ListProductsByStoreQueryHandler from '../../../../../../src/application/product/query/list-products-by-store/list-products-by-store-query-handler'
import { ProductRepository } from '../../../../../../src/domain/product/repository/product-repository'

describe('ListProductsByStore unit test suite', () => {
    const stubs = {
        productRepository: {
            findByStore: jest.fn()
        } as InterfaceMock<ProductRepository>
    }
    const listProductsByStore = new ListProductsByStoreQueryHandler(stubs.productRepository)

    test('Should call productRepository.findByStore once with arguments', async () => {
        const storeId = '12345'
        const query = new ListProductsByStoreQuery(storeId)

        await listProductsByStore.execute(query)

        const expectedTimes = 1
        const expectedArguments = '12345'
        expect(stubs.productRepository.findByStore).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.findByStore).toHaveBeenCalledWith(expectedArguments)
    })
})
