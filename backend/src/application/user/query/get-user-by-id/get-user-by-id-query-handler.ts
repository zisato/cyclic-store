import { GetUserByIdQuery } from './get-user-by-id-query';
import { User } from '../../../../domain/user/user';
import { UserRepository } from '../../../../domain/user/repository/user-repository';

export default class GetUserByIdQueryHandler {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(query: GetUserByIdQuery): Promise<User> {
        return this.userRepository.get(query.id);
    }
}