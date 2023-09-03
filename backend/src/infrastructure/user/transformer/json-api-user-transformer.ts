import { Store } from '../../../domain/store/store';
import { User } from '../../../domain/user/user';

type JsonApiUser = {
  id: string;
  attributes: {
    roles: string[];
  };
  relationships: {
    store: {
      id: string | null;
    }
  }
};

export default class JsonApiUserTransformer {
  async transformArray(users: User[], stores: Store[]): Promise<JsonApiUser[]> {
    const result = [];

    for (const user of users) {
      const store = stores.find((store) => {
        return store.sellerId === user.id;
      })

      result.push(await this.transform(user, store));
    }

    return result;
  }

  async transform(user: User, store: Store | undefined): Promise<JsonApiUser> {
    return {
      id: user.id,
      attributes: {
        roles: user.roles,
      },
      relationships: {
        store: {
          id: store ? store.id : null
        }
      }
    };
  }
}
