import React, {Component} from 'react';
import './App.css';
import {Repository} from "./PokemonRepository/Repository";
import PokemonList from "./PokemonList/PokemonList";
import {Pokemon} from "./PokemonRepository/Pokemon";

export default class App extends Component<{ getPokemon: Repository<Pokemon> }> {

    public static display(getPokemon: Repository<Pokemon>) {
        return <App getPokemon={getPokemon}/>;
    }

    render() {
        return (
            <div className="App">
                <PokemonList getPokemon={this.props.getPokemon}/>
            </div>
        );
    }
}
