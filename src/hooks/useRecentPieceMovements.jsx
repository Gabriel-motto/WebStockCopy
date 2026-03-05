import { getRecentPieceMovements } from "@/services/recentPieceMovements";
import { useEffect, useState } from "react";

export function useRecentPieceMovements(options = {}) {
    const {
        machine = "all",
        pieceId = "",
        warehouse = "",
        serial = "",
        orderBy = null,
        asc = true,
    } = options;
    const [movements, setMovements] = useState([]);

    useEffect(() => {
        getRecentPieceMovements(machine, pieceId, warehouse, serial, orderBy, asc).then(
            setMovements
        );
    }, [machine, pieceId, warehouse, serial, orderBy, asc]);

    return movements;
}
