import { Category } from '../category';

export interface CategoryRepository {
    exists(id: string): Promise<boolean>

    find(): Promise<Category[]>

    get(id: string): Promise<Category>

    save(category: Category): Promise<void>
}