import { AddSellerRoleCommand } from '../../../../../../src/application/user/command/add-seller-role/add-seller-role-command'
import AddSellerRoleCommandHandler from '../../../../../../src/application/user/command/add-seller-role/add-seller-role-command-handler'
import { InterfaceMock } from '../../../../../helpers/interface-mock'
import { User } from '../../../../../../src/domain/user/user'
import { UserRepository } from '../../../../../../src/domain/user/repository/user-repository'

describe('AddSellerRoleCommandHandler unit test suite', () => {
    const stubs = {
        userRepository: {
            get: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<UserRepository>
    }
    const createSeller = new AddSellerRoleCommandHandler(stubs.userRepository)

    test('Should call userRepository.get once with arguments', async () => {
        const id = '12345'
        const providerId = '54321'
        const user = new User({ id, providerId, roles: [] })
        const command = new AddSellerRoleCommand(id)
        stubs.userRepository.get.mockResolvedValueOnce(user)

        await createSeller.execute(command)

        const expectedTimes = 1
        const expectedArguments = '12345'
        expect(stubs.userRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.userRepository.get).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call userRepository.save once with arguments', async () => {
        const id = '12345'
        const providerId = '54321'
        const user = new User({ id, providerId, roles: [] })
        const command = new AddSellerRoleCommand(id)
        stubs.userRepository.get.mockResolvedValueOnce(user)

        await createSeller.execute(command)

        const expectedTimes = 1
        const expectedArguments = new User({ id, providerId, roles: ['seller'] })
        expect(stubs.userRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.userRepository.save).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should not add when is included', async () => {
        const id = '12345'
        const providerId = '54321'
        const user = new User({ id, providerId, roles: ['seller'] })
        const command = new AddSellerRoleCommand(id)
        stubs.userRepository.get.mockResolvedValueOnce(user)

        await createSeller.execute(command)

        const expectedTimes = 1
        const expectedArguments = new User({ id, providerId, roles: ['seller'] })
        expect(stubs.userRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.userRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
