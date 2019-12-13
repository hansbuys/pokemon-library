import {Pokemon} from "./Pokemon";

export interface PokemonRepository {
    getAll(): Promise<Pokemon[]>
}