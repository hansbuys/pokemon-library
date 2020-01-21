import React, {Component} from 'react';
import {Paginated, PokemonRepository} from "../PokemonRepository/PokemonRepository";
import {Pokemon} from "../PokemonRepository/Pokemon";
import {PokemonListHeader} from "./PokemonListHeader";
import {Pagination} from "../Pagination/Pagination";
import './PokemonList.css';
import {PokemonListItem} from "./PokemonListItem";
import LoadingImage from "./loading.gif"

export default class PokemonList extends Component<PokemonListProps, PokemonListState> {

    private readonly loadingImage = LoadingImage;

    constructor(props: { getPokemon: PokemonRepository }) {
        super(props);
        this.state = {
            pageMode: PageMode.LOADING,
        };
    }
    componentDidMount(): void {
        this.fetchPage();
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
        return <div>
            <PokemonListHeader/>
            <img alt="loading" className="loading" src={this.loadingImage}/>
        </div>;
    }

    private renderLoaded(pokemon: Paginated<Pokemon>) {
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
        this.setState({
            pageMode: PageMode.LOADING,
        });
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
    getPokemon: PokemonRepository
}

type PokemonListState = PokemonListLoading | PokemonListLoaded

type PokemonListLoading = {
    pageMode: PageMode.LOADING
}

type PokemonListLoaded = {
    pageMode: PageMode.LOADED
    pokemon: Paginated<Pokemon>
}

enum PageMode {
    LOADING = "LOADING",
    LOADED = "LOADED"
}
