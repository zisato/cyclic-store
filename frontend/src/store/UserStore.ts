import { ApiClientUserRepository } from '../repositories/ApiClientUserRepository';
import { TokenLocalStorage } from '../storage/TokenLocalStorage';
import { User } from '../models/User';
import { UserLocalStorage } from '../storage/UserLocalStorage';
import { defineStore } from 'pinia';

interface State {
    user: User | null;
}

const getUser = (): User | null => {
    return UserLocalStorage.get();
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

            TokenLocalStorage.remove();

            UserLocalStorage.remove();
        },
        addStoreId(storeId: string): void {
            if (this.user) {
                this.user = { ...this.user, storeId }

                UserLocalStorage.set(this.user);
            }
        },
        async addSellerRole(): Promise<void> {
            if (this.user === null) {
                return;
            }

            if (this.user.roles.includes('seller')) {
                return;
            }
            
            const userRepository = new ApiClientUserRepository()

            await userRepository.addSellerRole(this.user.id);

            this.user.roles.push('seller');

            UserLocalStorage.set(this.user);
        },
        async fetchByToken(token: string): Promise<void> {
            const userRepository = new ApiClientUserRepository()

            this.user = await userRepository.getByToken(token)

            TokenLocalStorage.set({ token, id: this.user.id, roles: this.user.roles })

            UserLocalStorage.set(this.user);
        },
    }
});
