import { toaster } from "@/components/ui/toaster";
import { getPieceSerials, insertPieceSerials } from "@/services/pieceSerials";
import { useEffect, useState } from "react";

export function usePieceSerials(options = {}) {
    const { pieceId, column = "*" } = options;
    const [serials, setSerials] = useState([]);
    
    useEffect(() => {
        getPieceSerials(pieceId, column).then(setSerials);
    }, [pieceId, column]);

    return serials;
}

export function useInsertPieceSerials(values) {
    const promiseToaster = toaster.create({
            title: "Añadiendo stock...",
            description: "Por favor, espera mientras se añade el stock.",
            type: "loading",
        });
    
        try {
            for (let i = 0; i < values.amount; i++) {
                insertPieceSerials(values);
            }
    
            toaster.dismiss(promiseToaster.id);
            toaster.create({
                title: "Stock añadido",
                description: "El stock se ha añadido correctamente.",
                type: "success",
            });
        } catch (error) {
            toaster.dismiss(promiseToaster.id);
            toaster.create({
                title: `Error ${error.code} al añadir stock`,
                description: error.message,
                type: "error",
            });
        }
}
