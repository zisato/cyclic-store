import { Product } from '../../../domain/product/product';

type JsonApiProduct = {
    id: string;
    attributes: {
        name: string;
    };
};

export default class JsonApiProductTransformer {
    async transformArray(products: Product[]): Promise<JsonApiProduct[]> {
        const result = [];

        for (const product of products) {
          result.push(await this.transform(product));
        }
    
        return result;
    }

    async transform(product: Product): Promise<JsonApiProduct> {
        return {
            id: product.id,
            attributes: {
                name: product.name,
            },
        };
    }
}