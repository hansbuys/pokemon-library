import React, {Component} from 'react';
import {Paginated} from "../PokemonRepository/PokemonRepository";
import {Pokemon} from "../PokemonRepository/Pokemon";
import {PokemonListHeader} from "./PokemonListHeader";
import {Pagination} from "../Pagination/Pagination";
import './PokemonList.css';

type PokemonListProps = {
    pokemon: Paginated<Pokemon>,
    fetchPage: ((page?: number) => void)
}

export default class PokemonList extends Component<PokemonListProps> {
    render() {
        return (
            <div>
                <PokemonListHeader/>
                <ul className="pokemon">
                    {this.props.pokemon.results.map((value: Pokemon) =>
                        <li key={value.name}>
                            <img alt={value.name} src={value.imageUrl}/>
                            <p>{value.name}</p>
                        </li>)}
                </ul>
                <Pagination
                    pages={this.props.pokemon}
                    onPageChange={(newPage) => {
                        this.props.fetchPage(newPage)
                    }}/>
            </div>);
    }
}