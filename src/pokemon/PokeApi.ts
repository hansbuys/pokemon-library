import {PokemonRepository} from "./PokemonRepository";
import {Pokemon} from "./Pokemon";

export class PokeApi implements PokemonRepository {
    // private readonly baseUrl: string = "https://pokeapi.co/api/v2/";
    getAll(): Promise<Pokemon[]> {
        return new Promise<Pokemon[]>((resolve) => {
            resolve([{
                name: "Bulbasaur"
            }]);
        });
    }
}