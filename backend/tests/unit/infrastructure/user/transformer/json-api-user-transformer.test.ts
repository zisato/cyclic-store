import { User } from '../../../../../src/domain/user/user'
import JsonApiUserTransformer from '../../../../../src/infrastructure/user/transformer/json-api-user-transformer'

describe('JsonApiUserTransformer unit test', () => {
    const transformer = new JsonApiUserTransformer()

    test('Should transform single item', async () => {
        const userId = '12345'
        const providerId = 'provider-id'
        const roles = ['customer']
        const projection = new User({ id: userId, providerId, roles })

        const result = await transformer.transform(projection)

        const expectedResult = {
            id: '12345',
            attributes: {
              roles: ['customer'],
            },
        }
        expect(result).toEqual(expectedResult)
    })

    test('Should transform array of items', async () => {
        const user1Id = '12345'
        const provider1Id = 'provider-id-1'
        const user2Id = '54321'
        const provider2Id = 'provider-id-2'
        const roles = ['customer']
        const categories = [
            new User({ id: user1Id, providerId: provider1Id, roles }),
            new User({ id: user2Id, providerId: provider2Id, roles })
        ]

        const result = await transformer.transformArray(categories)

        const expectedResult = [
            {
                id: '12345',
                attributes: {
                  roles: ['customer']
                }
            },
            {
                id: '54321',
                attributes: {
                  roles: ['customer']
                }
            }
        ]
        expect(result).toEqual(expectedResult)
    })
})
