import {Pokemon} from "./pokemon/Pokemon";
import React from "react";

export function PokemonListItem(props: { pokemon: Pokemon }) {
    console.log(`Displaying ${props.pokemon.name} with image at ${props.pokemon.imageUrl}`);
    return <li><img alt={props.pokemon.name} src={props.pokemon.imageUrl}/>{props.pokemon.name}</li>;
}