export interface ProviderIdFromToken {
    resolveProviderId(token: string): Promise<string>;
}
