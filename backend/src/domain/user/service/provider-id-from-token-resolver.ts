import { ProviderIdFromToken } from './provider-id-from-token';
import { ProviderIdFromTokenNotFoundError } from '../../error/provider-id-from-token-not-found-error';

export class ProviderIdFromTokenResolver {
    constructor(private readonly providerIdsFromToken: ProviderIdFromToken[] = []) {}

    async resolveProviderId(token: string): Promise<string> {
        for (const providerIdFromToken of this.providerIdsFromToken) {
            try {
                return await providerIdFromToken.resolveProviderId(token);
            } catch (error) {
                if (!(error instanceof ProviderIdFromTokenNotFoundError)) {
                    throw error;
                }
            }
        }

        throw new ProviderIdFromTokenNotFoundError(`Cannot resolve provider id from token ${token}`);
    }
}
