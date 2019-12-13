import {Pokemon} from "../App";

export interface PokemonRepository {
    getAll(): Promise<Pokemon[]>
}