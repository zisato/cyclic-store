import { ProviderIdFromToken } from '../../../domain/user/service/provider-id-from-token';

export default class PlainProviderIdInToken implements ProviderIdFromToken {
    async resolveProviderId(token: string): Promise<string> {
        return token;
    }
}
