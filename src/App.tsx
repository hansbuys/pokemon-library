import React, {Component} from 'react';
import './App.css';
import {PokemonRepository} from "./PokemonRepository/PokemonRepository";
import PokemonList from "./PokemonList/PokemonList";

export default class App extends Component<{ getPokemon: PokemonRepository }> {

    render() {
        return (
            <div className="App">
                <PokemonList getPokemon={this.props.getPokemon}/>
            </div>
        );
    }
}
