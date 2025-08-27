import { useMemo } from "react";

export function usePagination({ totalPages, currentPage, siblingCount = 1 }) {
    // Simbolo elipsis
    const DOTS = "...";

    return useMemo(() => {
        // Numero maximo de slots que caben en el paginador
        const totalSlots = siblingCount * 2 + 5;

        // Sin elipsis si hay menos paginas que el total de slots
        if (totalPages <= totalSlots) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Excluye la primera y ultima de mostrarse doble
        const startPage = Math.max(2, currentPage - siblingCount);
        const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

        // Definicion de la elipsis a los lados
        const showLeftDots = startPage > 2;
        const showRightDots = endPage < totalPages - 1;

        const pages = [];

        // Siempre incluye primera pagina
        pages.push(1);

        // Mostrar elipsis izquierdo si necesario
        if (showLeftDots) {
            pages.push(DOTS);
        } else {
            for (let p = 2; p < startPage; p++) {
                pages.push(p);
            }
        }

        // Rango central entre startPage y endPage
        for (let p = startPage; p <= endPage; p++) {
            pages.push(p);
        }

        // Mostrar elipsis derecho si necesario
        if (showRightDots) {
            pages.push(DOTS);
        } else {
            for (let p = endPage + 1; p < totalPages; p++) {
                pages.push(p);
            }
        }

        // Siempre incluye la ultima pagina
        pages.push(totalPages);

        return pages;
    }, [totalPages, currentPage, siblingCount]);
}
