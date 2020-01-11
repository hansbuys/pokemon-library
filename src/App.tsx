import React, {Component} from 'react';
import './App.css';
import {Paginated, PokemonRepository} from "./PokemonRepository/PokemonRepository";
import {Pokemon} from "./PokemonRepository/Pokemon";
import PokemonList from "./PokemonList/PokemonList";

export default class App extends Component<{ getPokemon: PokemonRepository }, { pokemon: Paginated<Pokemon> }> {

    constructor(props: { getPokemon: PokemonRepository }) {
        super(props);
        this.state = {
            pokemon: {
                pageSize: 0,
                totalCount: 0,
                offset: 0,
                results: []
            }
        };
    }

    componentDidMount(): void {
        this.fetchPage();
    }

    render() {
        return (
            <div className="App">
                <PokemonList pokemon={this.state.pokemon} fetchPage={this.fetchPage.bind(this)}/>
            </div>
        );
    }

    private fetchPage(page?: number) {
        this.props.getPokemon.getAll(page ? page - 1 : undefined).then(result => {
            this.setState({
                pokemon: result
            })
        });
    }
}
