import { usePagination } from "@/hooks/usePagination.jsx";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import "./Pagination.css";

export default function PaginationControls({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
    siblingCount = 2,
    totalElements,
}) {
    const paginationRange = usePagination({
        totalPages,
        currentPage,
        siblingCount,
    });

    return (
        <div className="pagination-size-container">
            <ButtonGroup variant="ghost" className="pagination">
                {/* Botón Anterior */}
                <Button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}>
                    <HiChevronLeft />
                </Button>

                <div className="pages-numbers">
                    {/* Números de página con elipsis */}
                    {paginationRange.map((page, idx) => {
                        if (page === "...") {
                            return (
                                <span
                                    key={`dots-${idx}`}
                                    style={{ padding: "0 0.5rem" }}>
                                    {page}
                                </span>
                            );
                        }

                        return (
                            <Button
                                key={page}
                                onClick={() => onPageChange(page)}
                                style={{
                                    border:
                                        page === currentPage
                                            ? "1px solid"
                                            : "hidden",
                                }}>
                                {page}
                            </Button>
                        );
                    })}
                </div>

                {/* Botón Siguiente */}
                <Button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                    <HiChevronRight />
                </Button>
            </ButtonGroup>
            {/* Selector de tamaño de página */}
            <div className="page-size-selector">
                <label>
                    Mostrar{" "}
                    <select
                        value={pageSize}
                        onChange={(e) =>
                            onPageSizeChange(Number(e.target.value))
                        }>
                        {[10, 25, 50, 100, totalElements].map((size, idx) => (
                            <option
                                key={idx}
                                value={size}>
                                {size === totalElements ? "Todas" : size}
                            </option>
                        ))}
                    </select>{" "}
                    filas
                </label>
            </div>
        </div>
    );
}
