import React from "react";
import {Paginated} from "./pokemon/PokemonRepository";

export function Pagination(props: { pages: Paginated<any> }) {
    const pageSize = props.pages.results.length;

    if (props.pages.totalCount > pageSize) {
        const pageCount = Math.ceil(props.pages.totalCount / pageSize);
        const pages = Array.from(Array(pageCount).keys(), v => v + 1);
        console.log(`Number of pages: ${pageCount}`);
        return (
            <div>
                <ul>
                    <li>&lt;</li>
                    {
                        pages.map((i) =>
                            <li>{i}</li>
                        )
                    }
                    <li>&gt;</li>
                </ul>
            </div>
        );
    } else {
        return <div/>;
    }
}