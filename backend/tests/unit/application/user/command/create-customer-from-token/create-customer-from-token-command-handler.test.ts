import { CreateCustomerFromTokenCommand } from '../../../../../../src/application/user/command/create-customer-from-token/create-customer-from-token-command'
import CreateCustomerFromTokenCommandHandler from '../../../../../../src/application/user/command/create-customer-from-token/create-customer-from-token-command-handler'
import { InterfaceMock } from '../../../../../helpers/interface-mock'
import { InvalidArgumentError } from '../../../../../../src/domain/error/invalid-argument-error'
import { ProviderIdFromToken } from '../../../../../../src/domain/user/service/provider-id-from-token'
import { ProviderIdFromTokenNotFoundError } from '../../../../../../src/domain/error/provider-id-from-token-not-found-error'
import { ProviderIdFromTokenResolver } from '../../../../../../src/domain/user/service/provider-id-from-token-resolver'
import { UserRepository } from '../../../../../../src/domain/user/repository/user-repository'

describe('CreateCustomerFromTokenCommandHandler unit test suite', () => {
    const stubs = {
        providerIdFromToken: {
            resolveProviderId: jest.fn()
        } as InterfaceMock<ProviderIdFromToken>,
        userRepository: {
            existsByProviderId: jest.fn(),
            exists: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<UserRepository>
    }
    const createSeller = new CreateCustomerFromTokenCommandHandler(new ProviderIdFromTokenResolver([stubs.providerIdFromToken]), stubs.userRepository)

    test('Should call providerIdFromToken.resolveProviderId once with arguments', async () => {
        const providerId = 'provider-id';
        const id = '12345'
        const token = 'awesome-token'
        const command = new CreateCustomerFromTokenCommand(id, token)
        stubs.providerIdFromToken.resolveProviderId.mockResolvedValueOnce(providerId)
        stubs.userRepository.existsByProviderId.mockResolvedValueOnce(true)

        await createSeller.execute(command)

        const expectedTimes = 1
        const expectedArguments = 'awesome-token'
        expect(stubs.providerIdFromToken.resolveProviderId).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.providerIdFromToken.resolveProviderId).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when could not resolve provider id from token', async () => {
        const id = '12345'
        const token = 'awesome-token'
        const command = new CreateCustomerFromTokenCommand(id, token)
        stubs.providerIdFromToken.resolveProviderId.mockImplementationOnce(() => {
            throw new ProviderIdFromTokenNotFoundError(`Cannot resolve provider id from token ${token}`)
        })

        const promise = createSeller.execute(command)

        const expectedError = new ProviderIdFromTokenNotFoundError(`Cannot resolve provider id from token ${token}`)
        await expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should throw unexpected errors when resolver provider id', async () => {
        const id = '12345'
        const token = 'awesome-token'
        const command = new CreateCustomerFromTokenCommand(id, token)
        stubs.providerIdFromToken.resolveProviderId.mockImplementationOnce(() => {
            throw new Error('Unexpected provider error')
        })

        const promise = createSeller.execute(command)

        const expectedError = new Error('Unexpected provider error')
        await expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call userRepository.existsByProviderId once with arguments', async () => {
        const providerId = 'provider-id';
        const id = '12345'
        const token = 'awesome-token'
        const command = new CreateCustomerFromTokenCommand(id, token)
        stubs.providerIdFromToken.resolveProviderId.mockResolvedValueOnce(providerId)
        stubs.userRepository.existsByProviderId.mockResolvedValueOnce(true)

        await createSeller.execute(command)

        const expectedTimes = 1
        const expectedArguments = 'provider-id'
        expect(stubs.userRepository.existsByProviderId).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.userRepository.existsByProviderId).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should return when existing user by provider id', async () => {
        const providerId = 'provider-id';
        const id = '12345'
        const token = 'awesome-token'
        const command = new CreateCustomerFromTokenCommand(id, token)
        stubs.providerIdFromToken.resolveProviderId.mockResolvedValueOnce(providerId)
        stubs.userRepository.existsByProviderId.mockResolvedValueOnce(true)

        await createSeller.execute(command)

        expect(stubs.userRepository.exists).not.toHaveBeenCalled()
        expect(stubs.userRepository.save).not.toHaveBeenCalled()
    })

    test('Should call userRepository.exists once with arguments', async () => {
        const providerId = 'provider-id';
        const id = '12345'
        const token = 'awesome-token'
        const command = new CreateCustomerFromTokenCommand(id, token)
        stubs.providerIdFromToken.resolveProviderId.mockResolvedValueOnce(providerId)
        stubs.userRepository.existsByProviderId.mockResolvedValueOnce(false)
        stubs.userRepository.exists.mockResolvedValueOnce(false)

        await createSeller.execute(command)

        const expectedTimes = 1
        const expectedArguments = '12345'
        expect(stubs.userRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.userRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when user id exists', async () => {
        const providerId = 'provider-id';
        const id = '12345'
        const token = 'awesome-token'
        const command = new CreateCustomerFromTokenCommand(id, token)
        stubs.providerIdFromToken.resolveProviderId.mockResolvedValueOnce(providerId)
        stubs.userRepository.existsByProviderId.mockResolvedValueOnce(false)
        stubs.userRepository.exists.mockResolvedValueOnce(true)

        const promise = createSeller.execute(command)

        const expectedError = new InvalidArgumentError(`Existing User with id ${id}`)
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call userRepository.save once with arguments', async () => {
        const providerId = 'provider-id';
        const id = '12345'
        const token = 'awesome-token'
        const command = new CreateCustomerFromTokenCommand(id, token)
        stubs.providerIdFromToken.resolveProviderId.mockResolvedValueOnce(providerId)
        stubs.userRepository.existsByProviderId.mockResolvedValueOnce(false)
        stubs.userRepository.exists.mockResolvedValueOnce(false)

        await createSeller.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: '12345',
            providerId: 'provider-id',
            roles: ['customer']
        })
        expect(stubs.userRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.userRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
