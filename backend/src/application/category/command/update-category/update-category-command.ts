export class UpdateCategoryCommand {
  constructor(public readonly id: string, public readonly name?: string) {}
}
