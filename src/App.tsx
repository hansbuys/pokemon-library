import React, {Component} from 'react';
import './App.css';
import {Header} from "./MainPageHeader";
import {Paginated, PokemonRepository} from "./pokemon/PokemonRepository";
import {Pokemon} from "./pokemon/Pokemon";
import {PokemonListItem} from "./PokemonListItem";
import {Pagination} from "./Pagination";

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
        this.fetchPage();
    }

    render() {
        return (
            <div className="App">
                <Header/>
                <ul>
                    {
                        this.state.pokemon.results.map((value: Pokemon) =>
                            <PokemonListItem key={value.name} pokemon={value}/>)
                    }
                </ul>
                <Pagination pages={this.state.pokemon} onPageChange={(newPage) => {
                    this.fetchPage(newPage)
                }}/>
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
