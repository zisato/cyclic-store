import PlainProviderIdInToken from '../../../../../src/infrastructure/user/service/plain-provider-id-in-token';


describe('PlainProviderIdInToken unit test', () => {
    const providerId = new PlainProviderIdInToken()

    test('Should return argument value', async () => {
        const token = 'awesome-token'

        const result = await providerId.resolveProviderId(token)

        const expectedResult = 'awesome-token'
        expect(result).toEqual(expectedResult)
    })
})
