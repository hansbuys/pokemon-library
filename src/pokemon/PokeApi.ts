import {PokemonRepository} from "./PokemonRepository";
import {Pokemon} from "./Pokemon";
import * as restm from 'typed-rest-client/RestClient';

type PokemonList = {
    count: number
    next: string
    previous: string
    results: {
        name: string
        url: string
    }[]
}

export class PokeApi implements PokemonRepository {
    private readonly baseUrl: string = "https://pokeapi.co";
    private readonly client = new restm.RestClient("", this.baseUrl);

    getAll(): Promise<Pokemon[]> {
        return this.client.get<PokemonList>("/api/v2/pokemon").then(value => {
            if (!value.result) {
                return Promise.resolve([]);
            }
            return value.result.results.map((p) => ({name: p.name}));
        });
    }
}