import UpdateCategoryCommandHandler from '../../../../../../src/application/category/command/update-category/update-category-command-handler'
import { UpdateCategoryCommand } from '../../../../../../src/application/category/command/update-category/update-category-command'
import { CategoryRepository } from '../../../../../../src/domain/category/repository/category-repository'
import { InterfaceMock } from '../../../../../helpers/interface-mock'
import { Category } from '../../../../../../src/domain/category/category'

describe('UpdateCategoryCommandHandler unit test suite', () => {
    const stubs = {
        categoryRepository: {
            get: jest.fn(),
            save: jest.fn()
        } as InterfaceMock<CategoryRepository>
    }
    const updateCategory = new UpdateCategoryCommandHandler(stubs.categoryRepository)

    test('Should call categoryRepository.get once with arguments', async () => {
        const id = '12345'
        const name = 'category-name'
        const newName = 'new-category-name'
        const category = new Category({ id, name})
        const command = new UpdateCategoryCommand(id, newName)
        stubs.categoryRepository.get.mockResolvedValueOnce(category)

        await updateCategory.execute(command)

        const expectedTimes = 1
        const expectedArguments = id
        expect(stubs.categoryRepository.get).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.categoryRepository.get).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should not change name when undefined value', async () => {
        const id = '12345'
        const name = 'category-name'
        const newName = undefined
        const category = new Category({ id, name})
        const command = new UpdateCategoryCommand(id, newName)
        stubs.categoryRepository.get.mockResolvedValueOnce(category)

        await updateCategory.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: '12345',
            name: 'category-name'
        })
        expect(stubs.categoryRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.categoryRepository.save).toHaveBeenCalledWith(expectedArguments)
    })

    test('Should call categoryRepository.save once with arguments', async () => {
        const id = '12345'
        const name = 'category-name'
        const newName = 'new-category-name'
        const category = new Category({ id, name})
        const command = new UpdateCategoryCommand(id, newName)
        stubs.categoryRepository.get.mockResolvedValueOnce(category)

        await updateCategory.execute(command)

        const expectedTimes = 1
        const expectedArguments = expect.objectContaining({
            id: '12345',
            name: 'new-category-name'
        })
        expect(stubs.categoryRepository.save).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.categoryRepository.save).toHaveBeenCalledWith(expectedArguments)
    })
})
