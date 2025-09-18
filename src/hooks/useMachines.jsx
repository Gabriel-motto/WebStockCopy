import { useEffect, useState } from "react";
import { getMachines, getPiecesFromMachines } from "../services/machines";

export function useMachines(options = {}) {
    const { selectedALines = [], search = "", debouncedSearch, columns = "*" } = options;
    const [machines, setMachines] = useState([]);

    useEffect(() => {
        getMachines(selectedALines, search, columns).then(setMachines);
    }, [JSON.stringify(selectedALines), debouncedSearch ? debouncedSearch : search, columns]);
    return machines;
}

export function useSelectedMachine(name) {
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        getPiecesFromMachines(name).then(setPieces);
    }, [name]);
    return pieces;
}

export function useSelectedMachineStock(machine, piece) {
    const [stock, setStock] = useState();

    useEffect(() => {
        getStockPieceFromMachine(machine, piece).then(setStock);
    }, [machine, piece]);
    return stock;
}
