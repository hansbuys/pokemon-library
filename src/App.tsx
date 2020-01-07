import React, {Component} from 'react';
import './App.css';
import {Header} from "./MainPageHeader";
import {Paginated, PokemonRepository} from "./pokemon/PokemonRepository";
import {Pokemon} from "./pokemon/Pokemon";
import {PokemonListItem} from "./PokemonListItem";

export default class App extends Component<{ getPokemon: PokemonRepository }, { pokemon: Paginated<Pokemon> }> {

    constructor(props: { getPokemon: PokemonRepository }) {
        super(props);
        this.state = {
            pokemon: {
                totalCount: 0,
                offset: 0,
                results: []
            }
        };
    }

    componentDidMount(): void {
        this.props.getPokemon.getAll().then(result => {
            this.setState({
                pokemon: result
            })
        });
    }

    render() {
        return (
            <div className="App">
                <Header/>
                <ul>
                    {
                        this.state.pokemon.results.map((value: Pokemon) =>
                            <PokemonListItem pokemon={value}/>)
                    }
                </ul>
            </div>
        );
    }
}
