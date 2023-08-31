import { Product } from '../../../../../src/domain/product/product'
import JsonApiProductTransformer from '../../../../../src/infrastructure/product/transformer/json-api-product-transformer'

describe('JsonApiProductTransformer unit test', () => {
    const transformer = new JsonApiProductTransformer()

    test('Should transform single item', async () => {
        const productId = '12345'
        const name = 'product'
        const storeId = '11111'
        const product = new Product({ id: productId, name, storeId })

        const result = await transformer.transform(product)

        const expectedResult = {
            id: productId,
            attributes: {
              name,
            },
        }
        expect(result).toEqual(expectedResult)
    })

    test('Should transform array of items', async () => {
        const product1Id = '12345'
        const name1 = 'product-1'
        const product2Id = '54321'
        const name2 = 'product-2'
        const storeId = '11111'
        const products = [
            new Product({ id: product1Id, name: name1, storeId }),
            new Product({ id: product2Id, name: name2, storeId })
        ]

        const result = await transformer.transformArray(products)

        const expectedResult = [
            {
                id: '12345',
                attributes: {
                  name: 'product-1'
                }
            },
            {
                id: '54321',
                attributes: {
                  name: 'product-2'
                }
            }
        ]
        expect(result).toEqual(expectedResult)
    })
})
