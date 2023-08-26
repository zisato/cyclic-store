import { CreateCustomerFromTokenCommand } from './create-customer-from-token-command';
import { InvalidArgumentError } from '../../../../domain/error/invalid-argument-error';
import { ProviderIdFromTokenResolver } from '../../../../domain/user/service/provider-id-from-token-resolver';
import { User } from '../../../../domain/user/user';
import { UserRepository } from '../../../../domain/user/repository/user-repository';

export default class CreateCustomerFromTokenCommandHandler {
  constructor(private readonly providerIdFromTokenResolver: ProviderIdFromTokenResolver, private readonly userRepository: UserRepository) {}

  async execute(command: CreateCustomerFromTokenCommand): Promise<void> {
    const providerId = await this.providerIdFromTokenResolver.resolveProviderId(command.token);

    const existsUserByProviderId = await this.userRepository.existsByProviderId(providerId);
    if (existsUserByProviderId) {
      return;
    }

    await this.ensureUserIdNotExists(command.id);

    const user = new User({ id: command.id, providerId: providerId, roles: ['customer'] });

    await this.userRepository.save(user);
  }

  async ensureUserIdNotExists(id: string): Promise<void> {
    if (await this.userRepository.exists(id)) {
      throw new InvalidArgumentError(`Existing User with id ${id}`);
    }
  }
}