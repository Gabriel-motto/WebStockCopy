import { getRecentPieceMovements } from "@/services/recentPieceMovements";
import { useEffect, useState } from "react";

export function useRecentPieceMovements(options = {}) {
    const { machine = "all", pieceId = "", warehouse = "", serial = "" } = options;
    const [movements, setMovements] = useState([]);

    useEffect(() => {
        getRecentPieceMovements(machine, pieceId, warehouse, serial).then(setMovements);
    }, [machine, pieceId, warehouse, serial]);

    return movements;
}
