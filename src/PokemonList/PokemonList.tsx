import React, {Component} from 'react';
import {Paginated, Repository} from "../PokemonRepository/Repository";
import {Pokemon} from "../PokemonRepository/Pokemon";
import {PokemonListHeader} from "./PokemonListHeader";
import {Pagination} from "../Pagination/Pagination";
import './PokemonList.css';
import {PokemonListItem} from "./PokemonListItem";
import LoadingImage from "./loading.gif"
import {Logging} from "../Logging";

enum PageMode {
    LOADING = "LOADING",
    LOADED = "LOADED"
}

export default class PokemonList extends Component<PokemonListProps, PokemonListState> {

    private readonly logger = Logging.createLogger(PokemonList);

    constructor(props: PokemonListProps) {
        super(props);
        this.state = {
            pageMode: PageMode.LOADING,
        };
    }

    componentDidMount(): void {
        this.fetchPage(this.props.page);
    }

    render() {
        switch (this.state.pageMode) {
            case PageMode.LOADING:
                return this.renderLoading();
            case PageMode.LOADED:
                return this.renderLoaded(this.state.pokemon);
        }
    }

    private renderLoading() {
        this.logger.trace("Loading pokemon...");
        return <div>
            <PokemonListHeader/>
            <img alt="loading" className="loading" src={LoadingImage}/>
        </div>;
    }

    private renderLoaded(pokemon: Paginated<Pokemon>) {
        this.logger.debug(`Loaded ${pokemon.results.length} pokemon...`);
        return <div>
            <PokemonListHeader/>
            <ul className="pokemon">
                {pokemon.results.map((p) =>
                    <PokemonListItem key={p.name} value={p}/>)}
            </ul>
            <Pagination
                pages={pokemon}
                onPageChange={(newPage) => {
                    this.fetchPage(newPage)
                }}/>
        </div>;
    }

    private fetchPage(page?: number) {
        if (this.state.pageMode !== PageMode.LOADING) {
            this.setState({
                pageMode: PageMode.LOADING,
            });
        }
        this.props.getPokemon
            .getAll(page ? page - 1 : undefined)
            .then(result => {
                this.setState({
                    pageMode: PageMode.LOADED,
                    pokemon: result
                })
            });
    }
}

type PokemonListProps = {
    getPokemon: Repository<Pokemon>,
    page?: number
}

type PokemonListState = PokemonListLoading | PokemonListLoaded

type PokemonListLoading = {
    pageMode: PageMode.LOADING
}

type PokemonListLoaded = {
    pageMode: PageMode.LOADED
    pokemon: Paginated<Pokemon>
}
