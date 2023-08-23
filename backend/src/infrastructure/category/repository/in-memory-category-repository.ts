import { Category } from '../../../domain/category/category';
import { CategoryRepository } from '../../../domain/category/repository/category-repository';

export default class InMemoryCategoryRepository implements CategoryRepository {
    private readonly data: Category[] = [];

    async exists(id: string): Promise<boolean> {
        return this.data.some((category: Category) => {
            return category.id === id;
        })
    }

    async save(category: Category): Promise<void> {
        this.data.push(category);
    }
}