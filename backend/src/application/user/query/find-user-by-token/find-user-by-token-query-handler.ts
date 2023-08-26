import { FindUserByTokenQuery } from './find-user-by-token-query';
import { ProviderIdFromTokenResolver } from '../../../../domain/user/service/provider-id-from-token-resolver';
import { User } from '../../../../domain/user/user';
import { UserRepository } from '../../../../domain/user/repository/user-repository';

export default class FindUserByTokenQueryHandler {
    constructor(private readonly providerIdFromTokenResolver: ProviderIdFromTokenResolver, private readonly userRepository: UserRepository) { }

    async execute(query: FindUserByTokenQuery): Promise<User> {
        const providerId = await this.providerIdFromTokenResolver.resolveProviderId(query.token);

        return this.userRepository.getByProviderId(providerId);
    }
}
