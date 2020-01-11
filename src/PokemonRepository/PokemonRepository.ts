import {Pokemon} from "./Pokemon";

export type Paginated<T> = {
    totalCount: number
    offset: number,
    pageSize: number
    results: T[]
}

export interface PokemonRepository {
    getAll(offset?: number): Promise<Paginated<Pokemon>>
}