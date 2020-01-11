import {Pokemon} from "./pokemon/Pokemon";
import React from "react";
import {Logging} from "./Logging";

export function PokemonListItem(props: { pokemon: Pokemon }) {
    const logger = Logging.createLogger(PokemonListItem);
    logger.trace(`Displaying ${props.pokemon.name} with image at ${props.pokemon.imageUrl}`);

    return <li><img alt={props.pokemon.name} src={props.pokemon.imageUrl}/>{props.pokemon.name}</li>;
}