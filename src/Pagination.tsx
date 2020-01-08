import React from "react";
import {Paginated} from "./pokemon/PokemonRepository";

export function Pagination(props: { pages: Paginated<any> }) {
    const pageSize = props.pages.results.length;

    if (props.pages.totalCount > pageSize) {
        const pageCount = Math.ceil(props.pages.totalCount / pageSize);
        const pages = Array.from(Array(Math.min(pageCount, 10)).keys(), v => v + 1);
        console.log(`Total number of pages: ${pageCount}`);

        return (
            <div>
                <ul className="pagination">
                    <li key="previous">&lt;</li>
                    {
                        pages.map((i) =>
                            <li key={i}>{i}</li>
                        )
                    }
                    <li key="next">&gt;</li>
                </ul>
            </div>
        );
    } else {
        return <div/>;
    }
}