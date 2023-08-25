import { Category } from '../../../domain/category/category';
import { CategoryRepository } from '../../../domain/category/repository/category-repository';
import { ModelNotFoundError } from '../../../domain/error/model-not-found-error';

export default class InMemoryCategoryRepository implements CategoryRepository {
    private readonly data: Category[] = [];

    async exists(id: string): Promise<boolean> {
        return this.data.some((category: Category) => {
            return category.id === id;
        })
    }

    async find(): Promise<Category[]> {
        return this.data;
    }

    async get(id: string): Promise<Category> {
        const existingCategoryIndex = this.data.findIndex((category: Category) => {
            return category.id === id;
        });
      
        if (existingCategoryIndex === -1) {
            throw new ModelNotFoundError(`Category with id ${id} not found`);
        }
      
        return this.data[existingCategoryIndex];
    }

    async save(category: Category): Promise<void> {
        const existingCategoryIndex = this.data.findIndex((data: Category) => {
            return category.id === data.id;
        });
      
        if (existingCategoryIndex >= 0) {
            this.data[existingCategoryIndex] = category;
        } else {
            this.data.push(category);
        }
    }
}