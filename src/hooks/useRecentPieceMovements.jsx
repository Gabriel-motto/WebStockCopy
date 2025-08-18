import { getRecentPieceMovements } from "@/services/recentPieceMovements";
import { useEffect, useState } from "react";

export function useRecentPieceMovements(options = {}) {
    const { machine = "all", piece = "", warehouse = [] } = options;
    const [movements, setMovements] = useState([]);

    useEffect(() => {
        getRecentPieceMovements(machine, piece, warehouse)
            .then(({ data }) => {
                setMovements(data);
            })
            .catch((error) => {
                console.error("Error fetching recent movements:", error);
            });
    }, [machine, piece, warehouse]);

    return movements;
}