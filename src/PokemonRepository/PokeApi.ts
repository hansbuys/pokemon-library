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
    private readonly logger = Logging.createLogger(PokeApi);

    getAll(offset?: number): Promise<Paginated<Pokemon>> {
        let queryParams = PokeApi.getQueryParams(Array.from([
            ["offset", offset ? offset * PokeApi.limit : undefined],
            ["limit", PokeApi.limit]
        ]));

        let pokemonListUrl = `/api/v2/pokemon${queryParams}`;
        this.logger.info(`Requesting ${pokemonListUrl}`);
        return this.client.get<PokemonList>(pokemonListUrl).then(value => {
            if (!value.result) {
                return Promise.resolve({totalCount: 0, offset: 0, pageSize: PokeApi.limit, results: []});
            }
            return {
                totalCount: value.result.count,
                offset: offset || 0,
                pageSize: PokeApi.limit,
                results: value.result.results.map((p) => PokeApi.toPokemon(p))
            };
        });
    }

    private static getQueryParams(params: ((string[] | (string | number | undefined)[])[])): string {
        return params.filter(([, value]) => {
            return value !== undefined;
        }).map(([key, value], i) => {
            if (i === 0) {
                return `?${key}=${value}`;
            } else {
                return `&${key}=${value}`;
            }
        }).join("");
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