import {Pokemon} from "./pokemon/Pokemon";
import React from "react";

export function PokemonListItem(props: { pokemon: Pokemon }) {
    return <li><img alt={props.pokemon.name} src={props.pokemon.imageUrl}/>{props.pokemon.name}</li>;
}