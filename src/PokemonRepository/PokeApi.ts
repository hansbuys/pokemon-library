import {Paginated, PokemonRepository} from "./PokemonRepository";
import {Pokemon} from "./Pokemon";
import {HttpRepository} from "./HttpRepository";
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

    private readonly logger = Logging.createLogger(PokeApi);
    private readonly httpRepo: HttpRepository = new HttpRepository(PokeApi.baseUrl);

    private emptyResult = {totalCount: 0, offset: 0, pageSize: PokeApi.limit, results: []};

    getAll(offset?: number): Promise<Paginated<Pokemon>> {
        let queryParams = Array.from([
            ["offset", offset ? offset * PokeApi.limit : undefined],
            ["limit", PokeApi.limit]
        ]);

        return this.httpRepo.get<PokemonList>(`/api/v2/pokemon`, queryParams).then(value => {
            if (!value.result) {
                return this.emptyResult;
            }
            return {
                totalCount: value.result.count,
                offset: offset || 0,
                pageSize: PokeApi.limit,
                results: value.result.results.map((p) => PokeApi.toPokemon(p))
            };
        }).catch(() => {
            this.logger.error("Error while fetching pokemon.");
            return this.emptyResult;
        });
    }

    private static toPokemon(p: PokemonResult): Pokemon {
        let id = PokeApi.parseIdFromUrl(p.url);
        let name = PokeApi.capitalize(p.name);

        return {
            id: id,
            name: name,
            imageUrl: PokeApi.imageUrlBase + id + ".png",
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