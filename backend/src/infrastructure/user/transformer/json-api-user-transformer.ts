import { User } from '../../../domain/user/user';

type JsonApiUser = {
  id: string;
  attributes: {
    roles: string[];
  };
};

export default class JsonApiUserTransformer {
  async transformArray(users: User[]): Promise<JsonApiUser[]> {
    const result = [];

    for (const user of users) {
      result.push(await this.transform(user));
    }

    return result;
  }

  async transform(user: User): Promise<JsonApiUser> {
    return {
      id: user.id,
      attributes: {
        roles: user.roles,
      },
    };
  }
}
