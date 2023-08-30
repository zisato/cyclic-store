import { FindUserByTokenQuery } from '../../../../../../src/application/user/query/find-user-by-token/find-user-by-token-query'
import FindUserByTokenQueryHandler from '../../../../../../src/application/user/query/find-user-by-token/find-user-by-token-query-handler'
import { InterfaceMock } from '../../../../../helpers/interface-mock'
import { ProviderIdFromToken } from '../../../../../../src/domain/user/service/provider-id-from-token'
import { ProviderIdFromTokenNotFoundError } from '../../../../../../src/domain/error/provider-id-from-token-not-found-error'
import { ProviderIdFromTokenResolver } from '../../../../../../src/domain/user/service/provider-id-from-token-resolver'
import { User } from '../../../../../../src/domain/user/user'
import { UserRepository } from '../../../../../../src/domain/user/repository/user-repository'

describe('FindUserByTokenQueryHandler unit test suite', () => {
    const stubs = {
        providerIdFromToken: {
            resolveProviderId: jest.fn()
        } as InterfaceMock<ProviderIdFromToken>,
        userRepository: {
            getByProviderId: jest.fn()
        } as InterfaceMock<UserRepository>
    }
    const findUser = new FindUserByTokenQueryHandler(new ProviderIdFromTokenResolver([stubs.providerIdFromToken]), stubs.userRepository)

    test('Should throw error when empty provider ids from token', async () => {
        const token = 'awesome-token'
        const query = new FindUserByTokenQuery(token)
        const findUserWithoutProviderIds = new FindUserByTokenQueryHandler(new ProviderIdFromTokenResolver(), stubs.userRepository)

        const promise = findUserWithoutProviderIds.execute(query)

        const expectedError = new ProviderIdFromTokenNotFoundError(`Cannot resolve provider id from token ${token}`)
        await expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call providerIdFromToken.resolveProviderId once with arguments', async () => {
        const token = 'awesome-token'
        const providerId = 'provider-id'
        const query = new FindUserByTokenQuery(token)
        stubs.providerIdFromToken.resolveProviderId.mockResolvedValueOnce(providerId)

        await findUser.execute(query)

        const expectedTimes = 1
        const expectedArguments = 'awesome-token'
        expect(stubs.providerIdFromToken.resolveProviderId).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.providerIdFromToken.resolveProviderId).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when could not resolve provider id from token', async () => {
        const token = 'awesome-token'
        const query = new FindUserByTokenQuery(token)
        stubs.providerIdFromToken.resolveProviderId.mockImplementationOnce(() => {
            throw new ProviderIdFromTokenNotFoundError(`Cannot resolve provider id from token ${token}`)
        })

        const promise = findUser.execute(query)

        const expectedError = new ProviderIdFromTokenNotFoundError(`Cannot resolve provider id from token ${token}`)
        await expect(promise).rejects.toThrowError(expectedError)
    })
    
    test('Should throw unexpected errors when resolver provider id', async () => {
        const token = 'awesome-token'
        const query = new FindUserByTokenQuery(token)
        stubs.providerIdFromToken.resolveProviderId.mockImplementationOnce(() => {
            throw new Error('Unexpected provider error')
        })

        const promise = findUser.execute(query)

        const expectedError = new Error('Unexpected provider error')
        await expect(promise).rejects.toThrowError(expectedError)
    })
    
    test('Should call userRepository.getByProviderId once with arguments', async () => {
        const token = 'awesome-token'
        const providerId = 'provider-id'
        const query = new FindUserByTokenQuery(token)
        stubs.providerIdFromToken.resolveProviderId.mockResolvedValueOnce(providerId)

        await findUser.execute(query)

        const expectedTimes = 1
        const expectedArguments = 'provider-id'
        expect(stubs.userRepository.getByProviderId).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.userRepository.getByProviderId).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should return userRepository.getByProviderId result', async () => {
        const token = 'awesome-token'
        const providerId = 'provider-id'
        const userId = '12345'
        const user = new User({ id: userId, providerId, roles: ['customer'] })
        const query = new FindUserByTokenQuery(token)
        stubs.providerIdFromToken.resolveProviderId.mockResolvedValueOnce(providerId)
        stubs.userRepository.getByProviderId.mockResolvedValueOnce(user)

        const result = await findUser.execute(query)

        const expectedResult = {
            id: '12345',
            providerId: 'provider-id',
            roles: ['customer']
        }
        expect(result).toEqual(expectedResult)
    })
})
