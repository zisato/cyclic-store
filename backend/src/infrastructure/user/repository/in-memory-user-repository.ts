import { ModelNotFoundError } from '../../../domain/error/model-not-found-error';
import { User } from '../../../domain/user/user';
import { UserRepository } from '../../../domain/user/repository/user-repository';

export default class InMemoryUserRepository implements UserRepository {
    private readonly data: User[] = [];

    async exists(id: string): Promise<boolean> {
        return this.data.some((user: User) => {
            return user.id === id;
        })
    }

    async existsByProviderId(providerId: string): Promise<boolean> {
        return this.data.some((user: User) => {
            return user.providerId === providerId;
        })
    }

    async get(id: string): Promise<User> {
        const existingUserIndex = this.data.findIndex((user: User) => {
            return user.id === id;
        });
      
        if (existingUserIndex === -1) {
            throw new ModelNotFoundError(`User with id ${id} not found`);
        }
      
        return this.data[existingUserIndex];
    }

    async getByProviderId(providerId: string): Promise<User> {
        const existingUserIndex = this.data.findIndex((user: User) => {
            return user.providerId === providerId;
        });
      
        if (existingUserIndex === -1) {
            throw new ModelNotFoundError(`User with providerId ${providerId} not found`);
        }
      
        return this.data[existingUserIndex];
    }

    async save(user: User): Promise<void> {
        const existingUserIndex = this.data.findIndex((data: User) => {
            return user.id === data.id;
        });
      
        if (existingUserIndex >= 0) {
            this.data[existingUserIndex] = user;
        } else {
            this.data.push(user);
        }
    }
}
