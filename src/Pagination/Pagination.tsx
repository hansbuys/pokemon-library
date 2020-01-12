import React from "react";
import {Paginated} from "../PokemonRepository/PokemonRepository";
import {Logging} from "../Logging";
import './Pagination.css';

export function Pagination(props: { pages: Paginated<any>, onPageChange: (newPage: number) => void }) {
    const logger = Logging.createLogger(Pagination);
    const numberOfPages = Math.ceil(props.pages.totalCount / props.pages.pageSize);
    const maxNumberOfPages = 10;

    function pageClick(pageNumber: number, currentPage: number) {
        if (pageNumber !== currentPage && pageNumber !== 0 && pageNumber <= numberOfPages) {
            props.onPageChange(pageNumber);
        }
    }

    if (props.pages.totalCount > props.pages.pageSize) {
        const currentPage = props.pages.offset + 1;
        logger.info(`Displaying page ${currentPage}/${numberOfPages}`);

        const maxOffset = Math.max(numberOfPages - maxNumberOfPages + 1, 1);
        const naiveOffset = Math.max(currentPage - Math.ceil(maxNumberOfPages / 2) + 1, 1);
        logger.trace(`Offsets: Naive=${naiveOffset} Max=${maxOffset}`);
        let offset = Math.min(maxOffset, naiveOffset);
        const pages = Array.from(Array(Math.min(numberOfPages, maxNumberOfPages)).keys(), v => v + offset);
        logger.trace(`Pages on page: ${pages.join(", ")}`);

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