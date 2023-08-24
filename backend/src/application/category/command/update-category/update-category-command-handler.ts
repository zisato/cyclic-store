import { CategoryRepository } from '../../../../domain/category/repository/category-repository';
import { UpdateCategoryCommand } from './update-category-command';

export default class UpdateCategoryCommandHandler {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(command: UpdateCategoryCommand): Promise<void> {
    let category = await this.categoryRepository.get(command.id);

    if (command.name !== undefined) {
      category = category.changeName(command.name);
    }

    this.categoryRepository.save(category);
  }
}
