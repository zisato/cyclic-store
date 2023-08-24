import { ApiClient } from '../clients/api-client'
import { Category } from '../models/category'

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
}
