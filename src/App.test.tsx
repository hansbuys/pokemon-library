import React from 'react';
import {render, waitForDomChange, waitForElement} from '@testing-library/react';
import App from './App';
import {Paginated, PokemonRepository} from "./pokemon/PokemonRepository";
import {Pokemon} from "./pokemon/Pokemon";

describe("Main page tests", () => {
    test('Contains a header', () => {
        const {getByText} = render(<App getPokemon={new TestPokemonRepository([])}/>);
        const linkElement = getByText(/Pokemon Library/);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveClass("header")
    });

    test('Displays all pokemon on a single page', async () => {
        const multiple: Pokemon[] = generatePokemon(3);

        const {getByText} = render(<App getPokemon={new TestPokemonRepository(multiple)}/>);

        expect(await waitForElement(() => getByText(new RegExp(multiple[0].name)))).toBeInTheDocument();
        expect(await waitForElement(() => getByText(new RegExp(multiple[1].name)))).toBeInTheDocument();
        expect(await waitForElement(() => getByText(new RegExp(multiple[2].name)))).toBeInTheDocument();
    });

    test('Displays an image of the pokemon', async () => {
        const multiple: Pokemon[] = generatePokemon(1);

        const {getByAltText} = render(<App getPokemon={new TestPokemonRepository(multiple)}/>);

        const image = await waitForElement(() => getByAltText(new RegExp(multiple[0].name)));
        expect(image).toHaveAttribute("src", multiple[0].imageUrl);
    });

    test('Displays pokemon in a paginated way', async () => {
        const multiple: Pokemon[] = generatePokemon(3);

        const {getByText, queryByText} = render(<App getPokemon={new TestPokemonRepository(multiple, 1)}/>);

        expect(await waitForElement(() => getByText(new RegExp(multiple[0].name)))).toBeInTheDocument();

        // to ensure that our repository is working correctly.
        expect(queryByText(new RegExp(multiple[1].name))).not.toBeInTheDocument();
        expect(queryByText(new RegExp(multiple[2].name))).not.toBeInTheDocument();

        // 3 pages, 1 pokemon each + navigation
        expect(queryByText("1")).toBeInTheDocument();
        expect(queryByText("2")).toBeInTheDocument();
        expect(queryByText("3")).toBeInTheDocument();
        expect(queryByText("<")).toBeInTheDocument();
        expect(queryByText(">")).toBeInTheDocument();
    });

    test('Displays correct number of pages', async () => {
        const multiple: Pokemon[] = generatePokemon(2);

        const {queryByText} = render(<App getPokemon={new TestPokemonRepository(multiple, 1)}/>);

        await waitForDomChange();

        // to ensure that our repository is working correctly.
        expect(queryByText(new RegExp(multiple[1].name))).not.toBeInTheDocument();

        // 3 pages, 1 pokemon each + navigation
        expect(queryByText("1")).toBeInTheDocument();
        expect(queryByText("2")).toBeInTheDocument();
        expect(queryByText("3")).not.toBeInTheDocument();
        expect(queryByText("<")).toBeInTheDocument();
        expect(queryByText(">")).toBeInTheDocument();
    });

    test('When all pokemon fit on a single page, there are no pagination controls', async () => {
        const multiple: Pokemon[] = generatePokemon(3);

        const {queryByText} = render(<App getPokemon={new TestPokemonRepository(multiple)}/>);

        await waitForDomChange();

        // 3 pages, 1 pokemon each + navigation
        expect(queryByText("1")).not.toBeInTheDocument();
        expect(queryByText("2")).not.toBeInTheDocument();
        expect(queryByText("3")).not.toBeInTheDocument();
        expect(queryByText("<")).not.toBeInTheDocument();
        expect(queryByText(">")).not.toBeInTheDocument();
    });

    test('Displays odd number of pages', async () => {
        const multiple: Pokemon[] = generatePokemon(3);

        const {queryByText} = render(<App getPokemon={new TestPokemonRepository(multiple, 2)}/>);

        await waitForDomChange();

        expect(queryByText("1")).toBeInTheDocument();
        expect(queryByText("2")).toBeInTheDocument();
        expect(queryByText("3")).not.toBeInTheDocument();
    });
});

class TestPokemonRepository implements PokemonRepository {

    private readonly _pokemon: Pokemon[];
    private readonly _limit: number;

    public constructor(pokemon: Pokemon[], limit?: number) {
        this._pokemon = pokemon;
        this._limit = limit || pokemon.length;
    }

    getAll(offset?: number): Promise<Paginated<Pokemon>> {
        let pageResult = this._pokemon.slice(offset, (offset || 0) + this._limit);
        let currentOffset = offset || 0;
        return new Promise<Paginated<Pokemon>>(res => res({
            totalCount: this._pokemon.length,
            offset: currentOffset,
            results: pageResult
        }));
    }
}

function generatePokemon(number: number) {
    return Array.from(Array(number).keys(), (i) => {
        return {name: `Pokemon ${i + 1}`, imageUrl: `http://url/pokemon/${i}.png`, id: i}
    });
}
