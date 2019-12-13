import React, {Component} from 'react';
import './App.css';
import {Header} from "./MainPageHeader";
import {PokemonRepository} from "./pokemon/PokemonRepository";

export type Pokemon = {
    name: string,
    sprite: string
}

interface GetPokemonProps {
    getPokemon: PokemonRepository
}
interface PokemonProps {
    pokemon: Pokemon[]
}

class App extends Component<GetPokemonProps, PokemonProps> {

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
        let list;
        if (this.state.pokemon) {
            list = this.state.pokemon.map((value: Pokemon, index: number) =>
                (<p>{index} - {value.name}</p>)
            )
        }

        return (
            <div className="App">
                <Header/>
                {
                    list
                }
            </div>
        );
    }
}

export default App;
