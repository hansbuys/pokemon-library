import React from "react";
import {Paginated} from "./pokemon/PokemonRepository";
import {Logging} from "./Logging";

export function Pagination(props: { pages: Paginated<any>, onPageChange: (newPage: number) => void }) {
    const logger = Logging.createLogger(Pagination);
    const numberOfPages = Math.ceil(props.pages.totalCount / props.pages.pageSize);

    function pageClick(pageNumber: number, currentPage: number) {
        if (pageNumber !== currentPage && pageNumber !== 0 && pageNumber <= numberOfPages) {
            props.onPageChange(pageNumber);
        }
    }

    if (props.pages.totalCount > props.pages.pageSize) {
        const pages = Array.from(Array(Math.min(numberOfPages, 10)).keys(), v => v + 1);

        const currentPage = props.pages.offset + 1;
        logger.info(`Displaying page ${currentPage}/${numberOfPages}`);

        return <div>
            <ul className="pagination">
                <li key="previous"
                    className={currentPage === 1 ? "disable" : ""}
                    onClick={() => pageClick(currentPage - 1, currentPage)}>&lt;</li>
                {pages.map((i) =>
                    <li key={i}
                        className={i === currentPage ? "active" : ""}
                        onClick={() => pageClick(i, currentPage)}>{i}</li>
                )}
                <li key="next"
                    className={currentPage === numberOfPages ? "disable" : ""}
                    onClick={() => pageClick(currentPage + 1, currentPage)}>&gt;</li>
            </ul>
        </div>;
    } else {
        return <div/>;
    }
}