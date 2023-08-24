import { Category } from '../../../../../src/domain/category/category'
import JsonApiCategoryTransformer from '../../../../../src/infrastructure/category/transformer/json-api-category-transformer'

describe('JsonApiCategoryTransformer unit test', () => {
    const transformer = new JsonApiCategoryTransformer()

    test('Should transform single item', async () => {
        const categoryId = '12345'
        const name = 'category'
        const projection = new Category({ id: categoryId, name })

        const result = await transformer.transform(projection)

        const expectedResult = {
            id: categoryId,
            attributes: {
              name,
            },
        }
        expect(result).toEqual(expectedResult)
    })

    test('Should transform array of items', async () => {
        const category1Id = '12345'
        const name1 = 'category-1'
        const category2Id = '54321'
        const name2 = 'category-2'
        const categories = [
            new Category({ id: category1Id, name: name1 }),
            new Category({ id: category2Id, name: name2 })
        ]

        const result = await transformer.transformArray(categories)

        const expectedResult = [
            {
                id: '12345',
                attributes: {
                  name: 'category-1'
                }
            },
            {
                id: '54321',
                attributes: {
                  name: 'category-2'
                }
            }
        ]
        expect(result).toEqual(expectedResult)
    })
})
