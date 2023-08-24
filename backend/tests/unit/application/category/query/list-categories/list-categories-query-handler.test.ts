import ListCategoriesQueryHandler from '../../../../../../src/application/category/query/list-categories/list-categories-query-handler'
import { ListCategoriesQuery } from '../../../../../../src/application/category/query/list-categories/list-categories-query'
import { CategoryRepository } from '../../../../../../src/domain/category/repository/category-repository'
import { InterfaceMock } from '../../../../../helpers/interface-mock'

describe('ListCategories unit test suite', () => {
    const stubs = {
        categoryRepository: {
            find: jest.fn()
        } as InterfaceMock<CategoryRepository>
    }
    const listCategories = new ListCategoriesQueryHandler(stubs.categoryRepository)

    test('Should call categoryRepository.find once with arguments', async () => {
        const query = new ListCategoriesQuery()

        await listCategories.execute(query)

        const expectedTimes = 1
        expect(stubs.categoryRepository.find).toHaveBeenCalledTimes(expectedTimes)
        expect(stubs.categoryRepository.find).toHaveBeenCalledWith()
    })
})
