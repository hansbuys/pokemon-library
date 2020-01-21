import React, {Component} from "react";
import {Paginated} from "../PokemonRepository/PokemonRepository";
import {Logging} from "../Logging";
import './Pagination.css';

type PaginationProps = {
    pages: Paginated<any>,
    onPageChange: (newPage: number) => void
}

export class Pagination extends Component<PaginationProps> {

    private readonly logger = Logging.createLogger(Pagination);
    private readonly maxNumberOfPages: number = 10;

    componentDidMount(): void {
        document.onkeydown = e => {
            const currentPage = this.props.pages.offset + 1;
            switch (e.key) {
                case "ArrowLeft":
                    this.pageClick(currentPage - 1);
                    break;

                case "ArrowRight":
                    this.pageClick(currentPage + 1);
                    break;

                default:
                    return;
            }
        };
    }

    pageClick(pageNumber: number): void {
        const numberOfPages = Math.ceil(this.props.pages.totalCount / this.props.pages.pageSize);
        const currentPage = this.props.pages.offset + 1;
        if (pageNumber !== currentPage && pageNumber !== 0 && pageNumber <= numberOfPages) {
            this.props.onPageChange(pageNumber);
        }
    }

    render() {
        if (this.props.pages.totalCount <= this.props.pages.pageSize || this.props.pages.totalCount === 0) {
            this.logger.warn("No pages to display.");
            return <div/>;
        }

        const numberOfPages = Math.ceil(this.props.pages.totalCount / this.props.pages.pageSize);
        const currentPage = this.props.pages.offset + 1;
        this.logger.info(`Displaying page ${currentPage}/${numberOfPages}`);

        const maxOffset = Math.max(numberOfPages - this.maxNumberOfPages + 1, 1);
        const naiveOffset = Math.max(currentPage - Math.ceil(this.maxNumberOfPages / 2) + 1, 1);
        this.logger.trace(`Offsets: Naive=${naiveOffset} Max=${maxOffset}`);

        let offset = Math.min(maxOffset, naiveOffset);
        const pages = Array.from(Array(Math.min(numberOfPages, this.maxNumberOfPages)).keys(), v => v + offset);
        this.logger.trace(`Pages on page: ${pages.join(", ")}`);

        return <div>
            <ul className="pagination">
                <li key="previous"
                    className={currentPage === 1 ? "disable" : ""}
                    accessKey=""
                    onClick={() => this.pageClick(currentPage - 1)}>&lt;</li>
                {pages.map((i) =>
                    <li key={i}
                        className={i === currentPage ? "active" : ""}
                        onClick={() => this.pageClick(i)}>{i}</li>
                )}
                <li key="next"
                    className={currentPage === numberOfPages ? "disable" : ""}
                    onClick={() => this.pageClick(currentPage + 1)}>&gt;</li>
            </ul>
        </div>;
    }
}