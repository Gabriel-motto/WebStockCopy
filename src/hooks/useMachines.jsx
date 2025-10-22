import { useEffect, useState } from "react";
import { getMachines, getPiecesFromMachines } from "../services/machines";

export function useMachines(options = {}) {
    const {
        selectedALines = [],
        search = "",
        debouncedSearch,
        column = "*",
    } = options;
    const [machines, setMachines] = useState([]);

    useEffect(() => {
        getMachines(selectedALines, search, column).then(setMachines);
    }, [
        JSON.stringify(selectedALines),
        debouncedSearch ? debouncedSearch : search,
        column,
    ]);
    return machines;
}

export function useSelectedMachine(options = {}) {
    const { machineId, column = "*" } = options;
    const [stock, setStock] = useState([]);

    useEffect(() => {
        getPiecesFromMachines(machineId, column).then(setStock);
    }, [machineId, column]);

    return stock;
}
