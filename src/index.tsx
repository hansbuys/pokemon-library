import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {PokemonRepository} from "./pokemon/PokemonRepository";
import {Pokemon} from "./pokemon/Pokemon";

ReactDOM.render(<App getPokemon={new class implements PokemonRepository {
    getAll(): Promise<Pokemon[]> {
        return new Promise<Pokemon[]>((resolve) => {
            resolve([{
                name: "Bulbasaur",
                sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
            }]);
        });
    }
}}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
