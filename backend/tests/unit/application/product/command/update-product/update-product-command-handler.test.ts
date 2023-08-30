import { InterfaceMock } from '../../../../../helpers/interface-mock'
import { Product } from '../../../../../../src/domain/product/product'
import { ProductRepository } from '../../../../../../src/domain/product/repository/product-repository'
import { UpdateProductCommand } from '../../../../../../src/application/product/command/update-product/update-product-command'
import UpdateProductCommandHandler from '../../../../../../src/application/product/command/update-product/update-product-command-handler'

describe('UpdateProductCommandHandler unit test suite', () => {
    const stubs = {
        productRepository: {
            get: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<ProductRepository>
    }
    const updateProduct = new UpdateProductCommandHandler(stubs.productRepository)

    test('Should call productRepository.get once with arguments', async () => {
        const id = '12345'
        const name = 'product-name'
        const newName = 'new-product-name'
        const storeId = '54321'
        const product = new Product({ id, name, storeId })
        const command = new UpdateProductCommand(id, newName)
        stubs.productRepository.get.mockResolvedValueOnce(product)

        await updateProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = id
        expect(stubs.productRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.get).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should not change name when undefined value', async () => {
        const id = '12345'
        const name = 'product-name'
        const newName = undefined
        const storeId = '54321'
        const product = new Product({ id, name, storeId })
        const command = new UpdateProductCommand(id, newName)
        stubs.productRepository.get.mockResolvedValueOnce(product)

        await updateProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: '12345',
            name: 'product-name'
        })
        expect(stubs.productRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.save).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call productRepository.save once with arguments', async () => {
        const id = '12345'
        const name = 'product-name'
        const newName = 'new-product-name'
        const storeId = '54321'
        const product = new Product({ id, name, storeId })
        const command = new UpdateProductCommand(id, newName)
        stubs.productRepository.get.mockResolvedValueOnce(product)

        await updateProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: '12345',
            name: 'new-product-name'
        })
        expect(stubs.productRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
