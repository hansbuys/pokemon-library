export type Paginated<T> = {
    totalCount: number
    offset: number,
    pageSize: number
    results: T[]
}

export interface Repository<T> {
    getAll(offset?: number): Promise<Paginated<T>>
}