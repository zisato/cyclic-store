import { InvalidArgumentError } from '../../../../domain/error/invalid-argument-error';
import { StoreRepository } from '../../../../domain/store/repository/store-repository';
import { Store } from '../../../../domain/store/store';
import { UserRepository } from '../../../../domain/user/repository/user-repository';
import { CreateStoreCommand } from './create-store-command';

export default class CreateStoreCommandHandler {
    constructor(private readonly storeRepository: StoreRepository, private readonly userRepository: UserRepository) {}
    
    async execute(command: CreateStoreCommand): Promise<void> {
        await this.ensureSellerCanCreateStore(command.sellerId);
        await this.ensureStoreIdNotExists(command.id);

        const store = new Store({ id: command.id, sellerId: command.sellerId, name: command.name });

        await this.storeRepository.save(store);
    }

    async ensureStoreIdNotExists(id: string): Promise<void> {
      if (await this.storeRepository.exists(id)) {
        throw new InvalidArgumentError(`Existing Store with id ${id}`);
      }
    }

    async ensureSellerCanCreateStore(id: string): Promise<void> {
      const user = await this.userRepository.get(id);

      if (!user.isSeller()) {
        throw new InvalidArgumentError(`User with id ${id} is not seller`);
      }

      const existstoreBySellerId = await this.storeRepository.existsBySellerId(user.id);
      if (existstoreBySellerId) {
        throw new InvalidArgumentError(`Seller with id ${id} has store`);
      }
    }
}