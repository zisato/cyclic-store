import { uniqueNamesGenerator, Config, colors, animals } from 'unique-names-generator';

export class UniqueNameGenerator {
    private static generatorConfig: Config = {
        dictionaries: [animals, colors],
        separator: '-',
        length: 2,
    };

    static generateName(): string {
        return uniqueNamesGenerator(this.generatorConfig);
    }
}