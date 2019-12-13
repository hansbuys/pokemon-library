import {Pokemon} from "./pokemon/Pokemon";
import React from "react";

export function PokemonListItem(props: { pokemon: Pokemon }) {
    return <li>{props.pokemon.name}</li>;
}