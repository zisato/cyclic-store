import { ApiClient } from '../clients/api-client'
import { Product } from '../models/Product'

type JsonApiResponse<T> = {
    data: T
}

type JsonApiProductDto = {
    id: string
    attributes: {
        name: string
    }
}

export class ApiClientProductRepository {
    private readonly apiClient: ApiClient

    constructor() {
        this.apiClient = new ApiClient()
    }

    async getById(productId: string): Promise<Product> {
        const response = await this.apiClient.get<JsonApiResponse<JsonApiProductDto>>(`/admin/products/${productId}`)

        return {
            id: response.body.data.id,
            name: response.body.data.attributes.name
        }
    }

    async update(product: Product): Promise<void> {
        await this.apiClient.patch(`/admin/products/${product.id}`, {
            data: {
                attributes: {
                    name: product.name,
                },
            },
        });
    }

    async findByCurrentUser(): Promise<Product[]> {
        const response = await this.apiClient.get<JsonApiResponse<JsonApiProductDto[]>>('/admin/products')

        return response.body.data.map((productDto) => {
            return {
                id: productDto.id,
                name: productDto.attributes.name
            }
        })
    }

    async findByStoreId(storeId: string): Promise<Product[]> {
        const response = await this.apiClient.get<JsonApiResponse<JsonApiProductDto[]>>(`/stores/${storeId}/products`)

        return response.body.data.map((productDto) => {
            return {
                id: productDto.id,
                name: productDto.attributes.name
            }
        })
    }

    async create(product: Product): Promise<void> {
        await this.apiClient.post('/admin/products', {
            data: {
                id: product.id,
                attributes: {
                    name: product.name,
                },
            },
        });
    }
}
