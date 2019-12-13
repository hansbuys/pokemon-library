import React from 'react';
import {render, waitForElement} from '@testing-library/react';
import App, {Pokemon} from './App';
import {PokemonRepository} from "./pokemon/PokemonRepository";

class TestPokemonRepository implements PokemonRepository {

    private readonly _pokemon: Pokemon[];

    public constructor(pokemon: Pokemon[]) {
        this._pokemon = pokemon;
    }

    getAll(): Promise<Pokemon[]> {
        const list = this._pokemon;
        const wait = (list: Pokemon[]) => new Promise<Pokemon[]>(res => res(list));
        return wait(list);
    }
}

test('Contains a header', () => {
    const {getByText} = render(<App getPokemon={new TestPokemonRepository([])}/>);
    const linkElement = getByText(/Pokemon Library/);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveClass("header")
});

test('Can render one pokemon', async () => {
    const bulbasaur: Pokemon = {
        name: "Bulbasaur",
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
    };

    const {getByText} = render(<App getPokemon={new TestPokemonRepository([bulbasaur])}/>);

    const textElement = await waitForElement(() => getByText(new RegExp(bulbasaur.name)));

    expect(textElement).toBeInTheDocument();
});
