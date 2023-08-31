import { ApiClientUserRepository } from '../repositories/ApiClientUserRepository';
import { TokenStorage } from '../storage/TokenStorage'
import { User } from '../models/User';
import { UserStorage } from '../storage/UserStorage';
import { defineStore } from 'pinia';

interface State {
    user: User | null;
}

const getUser = (): User | null => {
    const userStorage = new UserStorage();

    return userStorage.get();
};

export const useUserStore = defineStore({
    id: 'user',
    state: (): State => ({
        user: getUser(),
    }),
    getters: {
        hasUser: (state): boolean => {
            return state.user !== null
        },
        isSeller: (state): boolean => {
            return state.user !== null && state.user.roles.includes('seller')
        }
    },
    actions: {
        clear(): void {
            this.user = null;

            const tokenStorage = new TokenStorage();
            tokenStorage.remove();

            const userStorage = new UserStorage();
            userStorage.remove();
        },
        async fetchByToken(token: string): Promise<void> {
            const userRepository = new ApiClientUserRepository()

            this.user = await userRepository.getByToken(token)

            const tokenStorage = new TokenStorage();
            tokenStorage.set({ token, id: this.user.id, roles: this.user.roles })

            const userStorage = new UserStorage();
            userStorage.set(this.user);
        },
        async fetchById(id: string): Promise<void> {
            const repository = new ApiClientUserRepository();

            this.user = await repository.getById(id);

            const userStorage = new UserStorage();
            userStorage.set(this.user);
        }
    }
});
