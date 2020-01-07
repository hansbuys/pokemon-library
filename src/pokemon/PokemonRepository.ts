import {Pokemon} from "./Pokemon";

export type Paginated<T> = {
    totalCount: number
    offset: number,
    results: T[]
}

export interface PokemonRepository {
    getAll(offset?: number, limit?: number): Promise<Paginated<Pokemon>>
}