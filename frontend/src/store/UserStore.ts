import { ApiClientUserRepository } from '../repositories/ApiClientUserRepository';
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
    actions: {
        async fetchById(id: string): Promise<void> {
            const repository = new ApiClientUserRepository();

            this.user = await repository.getById(id);

            const userStorage = new UserStorage();
            userStorage.set(this.user);
        }
    }
});
