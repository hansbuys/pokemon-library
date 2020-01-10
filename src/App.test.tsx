import React from 'react';
import {
    fireEvent,
    Matcher,
    render,
    RenderResult,
    SelectorMatcherOptions,
    waitForDomChange,
    waitForElement
} from '@testing-library/react';
import App from './App';
import {Paginated, PokemonRepository} from "./pokemon/PokemonRepository";
import {Pokemon} from "./pokemon/Pokemon";

describe("Main page tests", () => {
    test('Contains a header', () => {
        const {getByText} = display();
        const linkElement = getByText(/Pokemon Library/);
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveClass("header")
    });

    test('Displays all pokemon on a single page', async () => {
        const multiple: Pokemon[] = generatePokemon(3);

        const {getByText} = display(multiple);

        expect(await waitForElement(() => getByText(new RegExp(multiple[0].name)))).toBeInTheDocument();
        expect(await waitForElement(() => getByText(new RegExp(multiple[1].name)))).toBeInTheDocument();
        expect(await waitForElement(() => getByText(new RegExp(multiple[2].name)))).toBeInTheDocument();
    });

    test('Displays an image of the pokemon', async () => {
        const multiple: Pokemon[] = generatePokemon(1);

        const {getByAltText} = display(multiple);

        const image = await waitForElement(() => getByAltText(new RegExp(multiple[0].name)));
        expect(image).toHaveAttribute("src", multiple[0].imageUrl);
    });

    test('Displays pokemon in a paginated way', async () => {
        const multiple: Pokemon[] = generatePokemon(3);

        const {getByText, queryByText} = display(multiple, 1);

        expect(await waitForElement(() => getByText(new RegExp(multiple[0].name)))).toBeInTheDocument();
        expect(queryByText(new RegExp(multiple[1].name))).not.toBeInTheDocument();
        expect(queryByText(new RegExp(multiple[2].name))).not.toBeInTheDocument();

        expectNumberOfPagesWithNavigation(3, queryByText);
    });

    test('Displays correct number of pages', async () => {
        const multiple: Pokemon[] = generatePokemon(2);

        const {queryByText} = display(multiple, 1);

        await waitForDomChange();

        expect(queryByText(new RegExp(multiple[1].name))).not.toBeInTheDocument();

        expectNumberOfPagesWithNavigation(2, queryByText);
    });

    test('When all pokemon fit on a single page, there are no pagination controls', async () => {
        const multiple: Pokemon[] = generatePokemon(3);

        const {queryByText} = display(multiple);

        await waitForDomChange();

        expectNoPagesAndNoNavigation(3, queryByText);
    });

    test('Displays odd number of pages', async () => {
        const multiple: Pokemon[] = generatePokemon(3);

        const {queryByText} = display(multiple, 2);

        await waitForDomChange();

        expectNumberOfPagesWithNavigation(2, queryByText);
    });

    test('Displays a maximum of 10 pages', async () => {
        const multiple: Pokemon[] = generatePokemon(11);

        const {queryByText} = display(multiple, 1);

        await waitForDomChange();

        expectNumberOfPagesWithNavigation(10, queryByText);
    });

    test('When a page is clicked, it shows that page', async () => {
        const multiple: Pokemon[] = generatePokemon(2);

        const {queryByText, getByText} = display(multiple, 1);

        expect(await waitForElement(() => queryByText(new RegExp(multiple[0].name)))).toBeInTheDocument();

        fireEvent.click(getByText("2"));

        expect(await waitForElement(() => queryByText(new RegExp(multiple[1].name)))).toBeInTheDocument();
        expect(queryByText(new RegExp(multiple[0].name))).not.toBeInTheDocument();
    });

    test("When the currently active page is clicked, it doesn't get fetch page", async () => {
        const multiple: Pokemon[] = generatePokemon(2);

        let repository = new TestPokemonRepository(multiple, 1);
        const {queryByText, getByText} = displayWithRepository(repository);

        expect(await waitForElement(() => queryByText(new RegExp(multiple[0].name)))).toBeInTheDocument();
        expect(repository.numberOfTimesGetAllIsCalled).toBe(1);

        fireEvent.click(getByText("1"));

        expect(repository.numberOfTimesGetAllIsCalled).toBe(1);
    });

    function display(pokemon?: Pokemon[], renderLimit?: number): RenderResult {
        return displayWithRepository(new TestPokemonRepository(pokemon || [], renderLimit));
    }

    function displayWithRepository(repository: PokemonRepository): RenderResult {
        return render(<App getPokemon={repository}/>);
    }

    function expectNumberOfPagesWithNavigation(exactNumPages: number, queryByText: (text: Matcher, options?: SelectorMatcherOptions) => (HTMLElement | null)) {
        for (let i = 1; i <= exactNumPages; i++) {
            expect(queryByText(`${i}`)).toBeInTheDocument();
        }
        expect(queryByText("<")).toBeInTheDocument();
        expect(queryByText(">")).toBeInTheDocument();

        expect(queryByText(`${exactNumPages + 1}`)).not.toBeInTheDocument();
    }

    function expectNoPagesAndNoNavigation(exactNumPages: number, queryByText: (text: Matcher, options?: SelectorMatcherOptions) => (HTMLElement | null)) {
        for (let i = 1; i <= exactNumPages; i++) {
            expect(queryByText(`${i}`)).not.toBeInTheDocument();
        }
        expect(queryByText("<")).not.toBeInTheDocument();
        expect(queryByText(">")).not.toBeInTheDocument();
    }
});

class TestPokemonRepository implements PokemonRepository {
    private readonly _pokemon: Pokemon[];

    private readonly _limit: number;
    private _numberOfTimesGetAllIsCalled = 0;

    public constructor(pokemon: Pokemon[], limit?: number) {
        this._pokemon = pokemon;
        this._limit = limit || pokemon.length;
    }

    get numberOfTimesGetAllIsCalled(): number {
        return this._numberOfTimesGetAllIsCalled;
    }

    getAll(offset?: number): Promise<Paginated<Pokemon>> {
        this._numberOfTimesGetAllIsCalled++;
        let start = offset;
        let end = (offset || 0) + this._limit;
        let pageResult = this._pokemon.slice(start, end);
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
