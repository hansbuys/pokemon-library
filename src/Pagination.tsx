import React from "react";
import {Paginated} from "./pokemon/PokemonRepository";
import {Logging} from "./Logging";

export function Pagination(props: { pages: Paginated<any>, onPageChange: (newPage: number) => void }) {
    const logger = Logging.createLogger(Pagination);
    const pageSize = props.pages.results.length;
    const numberOfPages = +props.pages.totalCount / pageSize;

    function pageClick(pageNumber: number, currentPage: number) {
        if (pageNumber !== currentPage && pageNumber !== 0 && pageNumber <= numberOfPages) {
            props.onPageChange(pageNumber);
        }
    }

    if (props.pages.totalCount > pageSize) {
        const pageCount = Math.ceil(props.pages.totalCount / pageSize);
        const pages = Array.from(Array(Math.min(pageCount, 10)).keys(), v => v + 1);

        const currentPage = props.pages.offset + 1;
        logger.info(`Displaying page ${currentPage}/${pageCount}`);

        return <div>
            <ul className="pagination">
                <li key="previous" onClick={() => pageClick(currentPage - 1, currentPage)}>&lt;</li>
                {pages.map((i) =>
                    <li key={i} onClick={() => pageClick(i, currentPage)}>{i}</li>
                )}
                <li key="next" onClick={() => pageClick(currentPage + 1, currentPage)}>&gt;</li>
            </ul>
        </div>;
    } else {
        return <div/>;
    }
}