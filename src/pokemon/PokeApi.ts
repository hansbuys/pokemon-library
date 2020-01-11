import {Paginated, PokemonRepository} from "./PokemonRepository";
import {Pokemon} from "./Pokemon";
import * as restm from "typed-rest-client/RestClient";
import {Logging} from "../Logging";

type PokemonList = {
    count: number
    next: string
    previous: string
    results: PokemonResult[]
}

type PokemonResult = {
    name: string
    url: string
}

export class PokeApi implements PokemonRepository {
    private static readonly baseUrl: string = "https://pokeapi.co";
    private static readonly imageUrlBase: string =
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
    private static readonly limit = 20;

    private readonly client = new restm.RestClient("", PokeApi.baseUrl);
    private readonly logger = Logging.createLogger("PokeApi");

    getAll(offset?: number): Promise<Paginated<Pokemon>> {
        let queryParams = `${(offset ? `?offset=${offset * PokeApi.limit}&limit=${PokeApi.limit}` : "")}`;
        this.logger.info(`Requesting /api/v2/pokemon${queryParams}`);

        return this.client.get<PokemonList>(`/api/v2/pokemon${queryParams}`).then(value => {
            if (!value.result) {
                return Promise.resolve({totalCount: 0, offset: 0, results: []});
            }
            return {
                totalCount: value.result.count,
                offset: offset || 0,
                results: value.result.results.map((p) => PokeApi.toPokemon(p))
            };
        });
    }

    private static toPokemon(p: PokemonResult): Pokemon {
        let id = PokeApi.parseIdFromUrl(p.url);
        let name = PokeApi.capitalize(p.name);

        return {
            name: name,
            imageUrl: PokeApi.imageUrlBase + id + ".png",
            id: id
        };
    }

    private static capitalize(s: string) {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    private static parseIdFromUrl(url: string): number {
        if (!url.match(/https:\/\/pokeapi\.co\/api\/v2\/pokemon\/\d+\//)) {
            return 0;
        }
        return +url
            .replace("https://pokeapi.co/api/v2/pokemon/", "")
            .replace("/", "");
    }
}