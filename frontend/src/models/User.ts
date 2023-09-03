export interface User {
    readonly id: string
    readonly roles: string[]
    readonly storeId: string | null
}
