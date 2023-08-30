import { CreateStoreCommand } from '../../../../../../src/application/store/command/create-store/create-store-command'
import CreateStoreCommandHandler from '../../../../../../src/application/store/command/create-store/create-store-command-handler'
import { InterfaceMock } from '../../../../../helpers/interface-mock'
import { InvalidArgumentError } from '../../../../../../src/domain/error/invalid-argument-error'
import { StoreRepository } from '../../../../../../src/domain/store/repository/store-repository'
import { User } from '../../../../../../src/domain/user/user'
import { UserRepository } from '../../../../../../src/domain/user/repository/user-repository'

describe('CreateStoreCommandHandler unit test suite', () => {
    const stubs = {
        storeRepository: {
            exists: jest.fn(),
            save: jest.fn(),
            existsBySellerId: jest.fn()
        } as InterfaceMock<StoreRepository>,
        userRepository: {
            get: jest.fn()
        } as InterfaceMock<UserRepository>
    }
    const createStore = new CreateStoreCommandHandler(stubs.storeRepository, stubs.userRepository)

    test('Should call userRepository.get once with arguments', async () => {
        const id = '12345'
        const sellerId = '54321'
        const name = 'store-name'
        const user = new User({ id: sellerId, providerId: 'provider-id', roles: ['seller'] })
        stubs.userRepository.get.mockResolvedValueOnce(user)
        stubs.storeRepository.existsBySellerId.mockResolvedValueOnce(false)

        const command = new CreateStoreCommand(id, sellerId, name)
        await createStore.execute(command)

        const expectedTimes = 1
        const expectedArguments = '54321'
        expect(stubs.userRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.userRepository.get).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when user is not seller', async () => {
        const id = '12345'
        const sellerId = '54321'
        const name = 'store-name'
        const user = new User({ id: sellerId, providerId: 'provider-id', roles: ['customer'] })
        stubs.userRepository.get.mockResolvedValueOnce(user)

        const command = new CreateStoreCommand(id, sellerId, name)
        const promise = createStore.execute(command)

        const expectedError = new InvalidArgumentError(`User with id ${sellerId} is not seller`)
        await expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should throw error when user has store', async () => {
        const id = '12345'
        const sellerId = '54321'
        const name = 'store-name'
        const user = new User({ id: sellerId, providerId: 'provider-id', roles: ['seller'] })
        stubs.userRepository.get.mockResolvedValueOnce(user)
        stubs.storeRepository.existsBySellerId.mockResolvedValueOnce(true)

        const command = new CreateStoreCommand(id, sellerId, name)
        const promise = createStore.execute(command)

        const expectedError = new InvalidArgumentError(`Seller with id ${sellerId} has store`)
        await expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should throw error when store id exists', async () => {
        const id = '12345'
        const sellerId = '54321'
        const name = 'store-name'
        const user = new User({ id: sellerId, providerId: 'provider-id', roles: ['seller'] })
        stubs.userRepository.get.mockResolvedValueOnce(user)
        stubs.storeRepository.existsBySellerId.mockResolvedValueOnce(false)
        stubs.storeRepository.exists.mockResolvedValueOnce(true)

        const command = new CreateStoreCommand(id, sellerId, name)
        const promise = createStore.execute(command)

        const expectedError = new Error(`Existing Store with id ${id}`)
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call storeRepository.save once with arguments', async () => {
        const id = '12345'
        const sellerId = '54321'
        const name = 'store-name'
        const user = new User({ id: sellerId, providerId: 'provider-id', roles: ['seller'] })
        stubs.userRepository.get.mockResolvedValueOnce(user)
        stubs.storeRepository.existsBySellerId.mockResolvedValueOnce(false)
        stubs.storeRepository.exists.mockResolvedValueOnce(false)

        const command = new CreateStoreCommand(id, sellerId, name)
        await createStore.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: '12345',
            sellerId: '54321',
            name: 'store-name'
        })
        expect(stubs.storeRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.storeRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
