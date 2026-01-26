import { useEffect, useState } from "react";
import { getMachines, getPiecesFromMachines } from "../services/machines";

export function useMachines(options = {}) {
    const {
        selectedALines = [],
        search = "",
        debouncedSearch,
        column = "*",
        getCriticals,
        id,
        multipleId,
    } = options;
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getMachines(selectedALines, search, column, getCriticals, id, multipleId).then((data) => {
            setMachines(data);
            setLoading(false);
        });
    }, [
        JSON.stringify(selectedALines),
        JSON.stringify(multipleId),
        search,
        debouncedSearch ? debouncedSearch : search,
        column,
        getCriticals,
        id,
    ]);
    return { machines, loading };
}

export function useSelectedMachine(options = {}) {
    const { machineId, column = "*" } = options;
    const [stock, setStock] = useState([]);

    useEffect(() => {
        getPiecesFromMachines(machineId, column).then(setStock);
    }, [machineId, column]);

    return stock;
}
