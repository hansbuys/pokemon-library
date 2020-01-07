import React from 'react';
import {render, waitForElement} from '@testing-library/react';
import App from './App';
import {Paginated, PokemonRepository} from "./pokemon/PokemonRepository";
import {Pokemon} from "./pokemon/Pokemon";

class TestPokemonRepository implements PokemonRepository {

    private readonly _pokemon: Pokemon[];

    public constructor(pokemon: Pokemon[]) {
        this._pokemon = pokemon;
    }

    getAll(): Promise<Paginated<Pokemon>> {
        return new Promise<Paginated<Pokemon>>(res => res({
            totalCount: this._pokemon.length,
            offset: 0,
            results: this._pokemon
        }));
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
            { name: "Bulbasaur", imageUrl: "", id: 0 },
            { name: "Blastoise", imageUrl: "", id: 1 },
            { name: "Charizard", imageUrl: "", id: 2 }
        ];

    const {getByText} = render(<App getPokemon={new TestPokemonRepository(multiple)}/>);

    expect(await waitForElement(() => getByText(new RegExp(multiple[0].name)))).toBeInTheDocument();
    expect(await waitForElement(() => getByText(new RegExp(multiple[1].name)))).toBeInTheDocument();
    expect(await waitForElement(() => getByText(new RegExp(multiple[2].name)))).toBeInTheDocument();
});

test('Can render image of pokemon', async () => {
    const multiple: Pokemon[] = [
            { name: "Bulbasaur", imageUrl: "http://source", id: 0}
        ];

    const {getByAltText} = render(<App getPokemon={new TestPokemonRepository(multiple)}/>);

    const bulbasaur = await waitForElement(() => getByAltText(new RegExp(multiple[0].name)));
    expect(bulbasaur).toHaveAttribute("src", multiple[0].imageUrl);
});
