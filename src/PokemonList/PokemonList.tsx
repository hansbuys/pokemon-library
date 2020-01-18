import React, {Component} from 'react';
import {Paginated, PokemonRepository} from "../PokemonRepository/PokemonRepository";
import {Pokemon} from "../PokemonRepository/Pokemon";
import {PokemonListHeader} from "./PokemonListHeader";
import {Pagination} from "../Pagination/Pagination";
import './PokemonList.css';
import {PokemonListItem} from "./PokemonListItem";

type PokemonListProps = {
    getPokemon: PokemonRepository
}

type PokemonListState = {
    pokemon: Paginated<Pokemon>
}

export default class PokemonList extends Component<PokemonListProps, PokemonListState> {

    constructor(props: { getPokemon: PokemonRepository }) {
        super(props);
        this.state = {
            pokemon: {
                pageSize: 0,
                totalCount: 0,
                offset: 0,
                results: []
            }
        };
    }

    componentDidMount(): void {
        this.fetchPage();
    }

    render() {
        return <div>
            <PokemonListHeader/>
            <ul className="pokemon">
                {this.state.pokemon.results.map((pokemon: Pokemon) =>
                    <PokemonListItem key={pokemon.name} value={pokemon}/>)}
            </ul>
            <Pagination
                pages={this.state.pokemon}
                onPageChange={(newPage) => {
                    this.fetchPage(newPage)
                }}/>
        </div>;
    }

    private fetchPage(page?: number) {
        this.props.getPokemon.getAll(page ? page - 1 : undefined).then(result => {
            this.setState({
                pokemon: result
            })
        });
    }
}