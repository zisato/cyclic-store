import { Category } from '../../../domain/category/category';

type JsonApiCategory = {
  id: string;
  attributes: {
    name: string;
  };
};

export default class JsonApiCategoryTransformer {
  async transformArray(categories: Category[]): Promise<JsonApiCategory[]> {
    const result = [];

    for (const category of categories) {
      result.push(await this.transform(category));
    }

    return result;
  }

  async transform(category: Category): Promise<JsonApiCategory> {
    return {
      id: category.id,
      attributes: {
        name: category.name,
      },
    };
  }
}
