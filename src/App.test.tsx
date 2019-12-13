import React from 'react';
import {render, waitForElement} from '@testing-library/react';
import App from './App';
import {PokemonRepository} from "./pokemon/PokemonRepository";
import {Pokemon} from "./pokemon/Pokemon";

class TestPokemonRepository implements PokemonRepository {

    private readonly _pokemon: Pokemon[];

    public constructor(pokemon: Pokemon[]) {
        this._pokemon = pokemon;
    }

    getAll(): Promise<Pokemon[]> {
        return new Promise<Pokemon[]>(res => res(this._pokemon));
    }
}

test('Contains a header', () => {
    const {getByText} = render(<App getPokemon={new TestPokemonRepository([])}/>);
    const linkElement = getByText(/Pokemon Library/);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveClass("header")
});

test('Can render multiple pokemon', async () => {
    const multiple: Pokemon[] = [
            { name: "Bulbasaur" },
            { name: "Blastoise" },
            { name: "Charizard" }
        ];

    const {getByText} = render(<App getPokemon={new TestPokemonRepository(multiple)}/>);

    expect(await waitForElement(() => getByText(new RegExp(multiple[0].name)))).toBeInTheDocument();
    expect(await waitForElement(() => getByText(new RegExp(multiple[1].name)))).toBeInTheDocument();
    expect(await waitForElement(() => getByText(new RegExp(multiple[2].name)))).toBeInTheDocument();
});
