import { CreateProductCommand } from '../../../../../../src/application/product/command/create-product/create-product-command'
import CreateProductCommandHandler from '../../../../../../src/application/product/command/create-product/create-product-command-handler'
import { InterfaceMock } from '../../../../../helpers/interface-mock'
import { InvalidArgumentError } from '../../../../../../src/domain/error/invalid-argument-error'
import { ModelNotFoundError } from '../../../../../../src/domain/error/model-not-found-error'
import { ProductRepository } from '../../../../../../src/domain/product/repository/product-repository'
import { StoreRepository } from '../../../../../../src/domain/store/repository/store-repository'

describe('CreateProductCommandHandler unit test suite', () => {
    const stubs = {
        productRepository: {
            exists: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<ProductRepository>,
        storeRepository: {
            exists: jest.fn()
        } as InterfaceMock<StoreRepository>
    }
    const createProduct = new CreateProductCommandHandler(stubs.productRepository, stubs.storeRepository)

    test('Should call productRepository.exists once with arguments', async () => {
        const id = '12345'
        const name = 'product-name'
        const storeId = '54321'
        const command = new CreateProductCommand(id, name, storeId)
        stubs.productRepository.exists.mockResolvedValueOnce(false)
        stubs.storeRepository.exists.mockResolvedValueOnce(true)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = id
        expect(stubs.productRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when product id exists', async () => {
        const id = '12345'
        const name = 'product-name'
        const storeId = '54321'
        const command = new CreateProductCommand(id, name, storeId)
        stubs.productRepository.exists.mockResolvedValueOnce(true)

        const promise = createProduct.execute(command)

        const expectedError = new InvalidArgumentError(`Existing Product with id ${id}`)
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call storeRepository.exists once with arguments', async () => {
        const id = '12345'
        const name = 'product-name'
        const storeId = '54321'
        const command = new CreateProductCommand(id, name, storeId)
        stubs.productRepository.exists.mockResolvedValueOnce(false)
        stubs.storeRepository.exists.mockResolvedValueOnce(true)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = '54321'
        expect(stubs.storeRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when store id not exists', async () => {
        const id = '12345'
        const name = 'product-name'
        const storeId = '54321'
        const command = new CreateProductCommand(id, name, storeId)
        stubs.productRepository.exists.mockResolvedValueOnce(false)
        stubs.storeRepository.exists.mockResolvedValueOnce(false)

        const promise = createProduct.execute(command)

        const expectedError = new ModelNotFoundError(`Store with id 54321 not found`)
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call productRepository.save once with arguments', async () => {
        const id = '12345'
        const name = 'product-name'
        const storeId = '54321'
        const command = new CreateProductCommand(id, name, storeId)
        stubs.productRepository.exists.mockResolvedValueOnce(false)
        stubs.storeRepository.exists.mockResolvedValueOnce(true)

        await createProduct.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: '12345',
            name: 'product-name',
            storeId: '54321'
        })
        expect(stubs.productRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.productRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
