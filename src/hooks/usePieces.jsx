import { useEffect, useState } from "react";
import {
    getMachinesStockPiece,
    getPieces,
    getTotalStockPiece,
    getWarehousesStockPiece,
    insertPiece,
    getImageName,
    updatePiece,
    deleteImage,
    insertImage,
} from "../services/pieces";
import supabase from "@/utils/supabase";
import { toaster } from "@/components/ui/toaster";

export function usePieces(options = {}) {
    const {
        workshop = "all",
        search = "",
        multiple = [],
        debouncedSearch,
        column = "*",
        orderBy = { column: "is_critical", ascending: false },
    } = options;
    const [pieces, setPieces] = useState([]);

    useEffect(() => {
        getPieces(workshop, search, multiple, column, orderBy).then(setPieces);
    }, [workshop, debouncedSearch, JSON.stringify(multiple)]);

    return pieces;
}

export function useTotalStockPiece(options = {}) {
    const { pieceId, column = "*" } = options;
    const [stock, setStock] = useState();

    useEffect(() => {
        getTotalStockPiece(pieceId, column).then(setStock);
    }, [pieceId]);

    return stock;
}

export function useMachinesStockPiece(options = {}) {
    const { pieceId, column = "*" } = options;
    const [stock, setStock] = useState();

    useEffect(() => {
        getMachinesStockPiece(pieceId, column).then(setStock);
    }, [pieceId]);

    return stock;
}

export function useWarehousesStockPiece(options = {}) {
    const { pieceId, column = "*" } = options;
    const [stock, setStock] = useState();

    useEffect(() => {
        getWarehousesStockPiece(pieceId, column).then(setStock);
    }, [pieceId]);

    return stock;
}

export async function useInsertPiece({ values }) {
    const promiseToaster = toaster.create({
        title: "Añadiendo pieza...",
        description: "Por favor, espera mientras se añade la pieza.",
        type: "loading",
    });

    try {
        insertPiece(values);

        toaster.dismiss(promiseToaster.id);
        toaster.create({
            title: "Pieza añadida",
            description: "La pieza se ha añadido correctamente.",
            type: "success",
        });
    } catch (error) {
        toaster.dismiss(promiseToaster.id);
        toaster.create({
            title: `Error ${error.code} al añadir pieza`,
            description: `${
                error.code === "23505"
                    ? "La pieza ya existe."
                    : error.message
            }`,
            type: "error",
        });
    }
}

export async function useUpdatePiece(updatedPiece, pieceImageOld, dataCardOld) {
    const promiseToaster = toaster.create({
        title: "Modificando pieza...",
        description: "Por favor, espera mientras se modifica la pieza.",
        type: "loading",
    });

    try {
        updatePiece(updatedPiece);

        toaster.dismiss(promiseToaster.id);
        toaster.create({
            title: "Pieza modificada",
            description: "La pieza se ha modificado correctamente.",
            type: "success",
        });
    } catch (error) {
        toaster.dismiss(promiseToaster.id);
        toaster.create({
            title: `Error ${error.code} al añadir pieza`,
            description: "Ha ocurrido un error al añadir la pieza.",
            type: "error",
        });
    }
}

export async function insertPieceInMachine({ values }) {
    const { error } = await supabase
        .from("machine_pieces")
        .insert([
            {
                piece: values.name,
                machine: values.location,
                amount: values.amount,
            },
        ])
        .throwOnError();
}

export async function insertPieceInWarehouse({ values }) {
    const { error } = await supabase
        .from("warehouse_pieces")
        .insert([
            {
                piece: values.name,
                location: values.location,
                amount: values.amount,
            },
        ])
        .throwOnError();
}

export function useImageName(options = {}) {
    const { bucket = "pieces", baseName } = options;
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        getImageName(bucket, baseName).then(setImageUrl);
    }, [bucket, baseName]);

    return imageUrl;
}
