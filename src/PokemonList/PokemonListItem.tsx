import {Pokemon} from "../PokemonRepository/Pokemon";
import React from "react";

export function PokemonListItem(props: { value: Pokemon }) {
    return <li>
        <img alt={props.value.name} src={props.value.imageUrl}/>
        <p>{props.value.name}</p>
    </li>;
}