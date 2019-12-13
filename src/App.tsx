import React, {Component} from 'react';
import './App.css';
import {Header} from "./MainPageHeader";
import {PokemonRepository} from "./pokemon/PokemonRepository";
import {Pokemon} from "./pokemon/Pokemon";

interface GetPokemonProps {
    getPokemon: PokemonRepository
}

interface AppProps {
    pokemon: Pokemon[]
}

export default class App extends Component<GetPokemonProps, AppProps> {

    constructor(props: GetPokemonProps) {
        super(props);
        this.state = {pokemon: []};
    }

    componentDidMount(): void {
        this.props.getPokemon.getAll().then(result => {
             this.setState({
                 pokemon: result
             })
        });
    }

    render() {
        const list = this.state.pokemon.map((value: Pokemon) =>
            <li><img src={value.sprite} alt={value.name}/> {value.name}</li>
        );

        return (
            <div className="App">
                <Header/>
                <ul>
                {
                    list
                }
                </ul>
            </div>
        );
    }
}
