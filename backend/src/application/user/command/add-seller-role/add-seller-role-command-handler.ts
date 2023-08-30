import { AddSellerRoleCommand } from './add-seller-role-command';
import { UserRepository } from '../../../../domain/user/repository/user-repository';

export default class AddSellerRoleCommandHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: AddSellerRoleCommand): Promise<void> {
    let user = await this.userRepository.get(command.id);

    user = user.addSellerRole();

    await this.userRepository.save(user);
  }
}