import React from 'react';
import {Paginated} from "../PokemonRepository/PokemonRepository";
import {Pokemon} from "../PokemonRepository/Pokemon";
import {PokemonListHeader} from "./PokemonListHeader";
import {Pagination} from "../Pagination/Pagination";
import './PokemonList.css';
import {PokemonListItem} from "./PokemonListItem";

type PokemonListProps = {
    pokemon: Paginated<Pokemon>,
    fetchPage: ((page?: number) => void)
}

export default function PokemonList(props: PokemonListProps) {
    return <div>
        <PokemonListHeader/>
        <ul className="pokemon">
            {props.pokemon.results.map((pokemon: Pokemon) =>
                <PokemonListItem key={pokemon.name} value={pokemon}/>)}
        </ul>
        <Pagination
            pages={props.pokemon}
            onPageChange={(newPage) => {
                props.fetchPage(newPage)
            }}/>
    </div>;
}