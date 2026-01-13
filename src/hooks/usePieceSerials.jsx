import { toaster } from "@/components/ui/toaster";
import {
    getPieceSerials,
    insertPieceSerials,
    updatePieceSerialsService,
} from "@/services/pieceSerials";
import { useEffect, useState } from "react";
import { useWarehouse } from "./useWarehouse";
import { useMachines } from "./useMachines";
import { insertRecentPieceMovementService } from "@/services/recentPieceMovements";

export function usePieceSerials(options = {}) {
    const { pieceId, search, column = "*" } = options;
    const [serials, setSerials] = useState([]);

    useEffect(() => {
        getPieceSerials(pieceId, search, column).then(setSerials);
    }, [pieceId, search, column]);

    return serials;
}

export async function useInsertPieceSerials(options = {}) {
    const { values, location, isMachine } = options;

    const promiseToaster = toaster.create({
        title: "Añadiendo stock...",
        description: "Por favor, espera mientras se añade el stock.",
        type: "loading",
    });

    try {
        for (let i = 0; i < values.amount; i++) {
            const newSerial = await insertPieceSerials(
                values,
                location,
                isMachine
            );
            const serial = await getPieceSerials(
                null,
                null,
                "serial_code",
                newSerial[0].id
            );
            values.serial = serial[0].serial_code;
            insertRecentPieceMovementService(
                values,
                null,
                location,
                null,
                isMachine
            );
            console.log(
                "Inserting piece serial with values:",
                values,
                "to location:",
                location,
                "isMachine:",
                isMachine
            );
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

export function updatePieceSerials(options = {}) {
    const { values, locationFrom, locationTo, isMachineFrom, isMachineTo } =
        options;

    const promiseToaster = toaster.create({
        title: "Actualizando stock...",
        description: "Por favor, espera mientras se actualiza el stock.",
        type: "loading",
    });

    try {
        updatePieceSerialsService(values, locationTo, isMachineTo);
        insertRecentPieceMovementService(
            values,
            locationFrom,
            locationTo,
            isMachineFrom,
            isMachineTo
        );

        toaster.dismiss(promiseToaster.id);
        toaster.create({
            title: "Stock actualizado",
            description: "El stock se ha actualizado correctamente.",
            type: "success",
        });
    } catch (error) {
        toaster.dismiss(promiseToaster.id);
        toaster.create({
            title: `Error ${error.code} al actualizar stock`,
            description: error.message,
            type: "error",
        });
    }
}
