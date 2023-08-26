import { User } from '../user';

export interface UserRepository {
    exists(id: string): Promise<boolean>;

    existsByProviderId(providerId: string): Promise<boolean>;

    get(id: string): Promise<User>;

    getByProviderId(providerId: string): Promise<User>;

    save(user: User): Promise<void>;
}