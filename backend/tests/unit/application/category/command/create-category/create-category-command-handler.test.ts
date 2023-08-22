import CreateCategoryCommandHandler from '../../../../../../src/application/category/command/create-category/create-category-command-handler'
import { CreateCategoryCommand } from '../../../../../../src/application/category/command/create-category/create-category-command'
import { CategoryRepository } from '../../../../../../src/domain/category/repository/category-repository'
import { InterfaceMock } from '../../../../../helpers/interface-mock'

describe('CreateCategoryCommandHandler unit test suite', () => {
    const stubs = {
        categoryRepository: {
            exists: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<CategoryRepository>
    }
    const createCategory = new CreateCategoryCommandHandler(stubs.categoryRepository)

    test('Should call categoryRepository.exists once with arguments', async () => {
        const id = 'category-id'
        const name = 'category-name'
        const command = new CreateCategoryCommand(id, name)
        stubs.categoryRepository.exists.mockResolvedValue(false)

        await createCategory.execute(command)

        const expectedTimes = 1
        const expectedArguments = id
        expect(stubs.categoryRepository.exists).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.categoryRepository.exists).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should throw error when category id exists', async () => {
        const id = 'category-id'
        const name = 'category-name'
        const command = new CreateCategoryCommand(id, name)
        stubs.categoryRepository.exists.mockResolvedValue(true)

        const promise = createCategory.execute(command)

        const expectedError = new Error(`Existing Category with id ${id}`)
        void expect(promise).rejects.toThrowError(expectedError)
    })

    test('Should call categoryRepository.save once with arguments', async () => {
        const id = 'category-id'
        const name = 'category-name'
        const command = new CreateCategoryCommand(id, name)
        stubs.categoryRepository.exists.mockResolvedValue(false)

        await createCategory.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: 'category-id',
            name: 'category-name'
        })
        expect(stubs.categoryRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.categoryRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
