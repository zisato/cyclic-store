import { Store } from '../../../domain/store/store';

type JsonApiStore = {
  id: string;
  attributes: {
    name: string;
  };
};

export default class JsonApiStoreTransformer {
  async transformArray(stores: Store[]): Promise<JsonApiStore[]> {
    const result = [];

    for (const store of stores) {
      result.push(await this.transform(store));
    }

    return result;
  }

  async transform(store: Store): Promise<JsonApiStore> {
    return {
      id: store.id,
      attributes: {
        name: store.name,
      },
    };
  }
}
