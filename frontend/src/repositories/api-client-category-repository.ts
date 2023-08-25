import { ApiClient } from '../clients/api-client'
import { Category } from '../models/category'

type JsonApiResponse<T> = {
    data: T
}

type JsonApiCategoryDto = {
    id: string
    attributes: {
        name: string
    }
}

export class ApiClientCategoryRepository {
    private readonly apiClient: ApiClient

    constructor () {
        this.apiClient = new ApiClient()
    }

    async create(category: Category): Promise<void> {
        await this.apiClient.post('/admin/categories', {
            data: {
                id: category.id,
                attributes: {
                    name: category.name
                }
            }
        })
    }

    async update(category: Category): Promise<void> {
        const url = `/admin/categories/${category.id}`;

        await this.apiClient.patch(url, {
            data: {
                attributes: {
                    name: category.name
                }
            }
        })
    }

    async findAll(): Promise<Category[]> {
        const response = await this.apiClient.get<JsonApiResponse<JsonApiCategoryDto[]>>('/admin/categories')

        return response.body.data.map((categoryDto) => {
            return {
                id: categoryDto.id,
                name: categoryDto.attributes.name
            }
        })
    }

    async findById(id: string): Promise<Category | undefined> {
        const categories = await this.findAll();

        return categories.find((category: Category) => {
            return category.id === id;
        })
    }
}
