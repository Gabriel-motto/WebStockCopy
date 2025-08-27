import { useEffect, useState } from "react";
import { getPieces, getStockPiece } from "../services/pieces";

export function usePieces(options = {}) {
    const {
        workshop = "all",
        search = "",
        multiple = [],
        debouncedSearch,
    } = options;
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        getPieces(workshop, search, multiple).then(setPieces);
    }, [workshop, debouncedSearch, JSON.stringify(multiple)]);

    return pieces;
}

export function useSelectedPiece(piece) {
    const [stock, setStock] = useState();

    useEffect(() => {
        getStockPiece(piece).then(setStock);
    }, [piece]);

    // const mappedStock = stock?.map(data => ({

    // }))
    // console.log(stock)

    return stock;
}
