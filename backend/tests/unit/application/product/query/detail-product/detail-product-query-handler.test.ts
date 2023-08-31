import { InterfaceMock } from '../../../../../helpers/interface-mock'
import { DetailProductQuery } from '../../../../../../src/application/product/query/detail-product/detail-product-query'
import DetailProductQueryHandler from '../../../../../../src/application/product/query/detail-product/detail-product-query-handler'
import { ProductRepository } from '../../../../../../src/domain/product/repository/product-repository'

describe('DetailProductByStore unit test suite', () => {
    const stubs = {
        productRepository: {
            get: jest.fn()
        } as InterfaceMock<ProductRepository>
    }
    const detailProductQueryHandler = new DetailProductQueryHandler(stubs.productRepository)

    test('Should call productRepository.get once with arguments', async () => {
        const productId = '12345'
        const query = new DetailProductQuery(productId)

        await detailProductQueryHandler.execute(query)

        const expectedTimes = 1
        const expectedArguments = '12345'
        expect(stubs.productRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.get).toHaveBeenCalledWith(expectedArguments)
    })
})
