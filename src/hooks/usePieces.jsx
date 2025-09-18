import { use, useEffect, useState } from "react";
import { getPieces, getStockPiece } from "../services/pieces";
import supabase from "@/utils/supabase";
import { toaster } from "@/components/ui/toaster";
import { useSelectedMachineStock } from "./useMachines";
import { useStockPieceFromWarehouse } from "./useWarehouse";

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

export async function insertPiece({ values }) {
    const promiseToaster = toaster.create({
        title: "Añadiendo pieza...",
        description: "Por favor, espera mientras se añade la pieza.",
        type: "loading",
    });

    try {
        const { error } = await supabase
            .from("Pieces")
            .insert([
                {
                    name: values.name,
                    brand: values.brand,
                    type: values.type,
                    workshop: values.workshop,
                    description: values.description,
                    buy_price: values.buyPrice,
                    repair_price: values.repairPrice,
                    supplier: values.supplier,
                    alternative_piece: values.altPiece,
                    additional_info: values.additionalInfo,
                },
            ])
            .throwOnError();

        values.locationType === "machine"
            ? insertPieceInMachine(values)
            : insertPieceInWarehouse(values);

        insertRecentMovement(values);

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
                    : "Ha ocurrido un error al añadir la pieza."
            }`,
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

export async function insertRecentMovement({ values }) {
    if (values.action === "new") {
        const { error } = await supabase
            .from("Latest_piece_actions")
            .insert([
                {
                    piece: values.name,
                    location_1: values.location,
                    action: values.action,
                    amount: values.amount,
                },
            ])
            .throwOnError();
    }
    if (values.action === "move") {
        const { error } = await supabase
            .from("Latest_piece_actions")
            .insert([
                {
                    piece: values.name,
                    location_1: values.locationFrom,
                    location_2: values.locationTo,
                    action: values.action,
                    amount: values.amount,
                },
            ])
            .throwOnError();
    }
    if (values.action === "repair") {
        const { error } = await supabase
            .from("Latest_piece_actions")
            .insert([
                {
                    piece: values.name,
                    location_1: values.location,
                    action: values.action,
                    amount: values.amount,
                },
            ])
            .throwOnError();
    }
}

export async function movePiece({ values }) {
    const fromStock =
        values.locationTypeFrom === "MACHINEFROM"
            ? useSelectedMachineStock(values.locationFrom, values.piece)
            : useStockPieceFromWarehouse(values.locationFrom, values.piece);
    const toStock =
        values.locationTypeTo === "MACHINETO"
            ? useSelectedMachineStock(values.locationTo, values.piece)
            : useStockPieceFromWarehouse(values.locationTo, values.piece);

    if (values.locationTypeFrom === "MACHINEFROM") {
        const { error } = await supabase
            .from("machine_pieces")
            .update({
                amount: fromStock[0].amount - 1,
            })
            .eq("machine", values.locationFrom)
            .eq("piece", values.piece)
            .throwOnError();
    }

    if (values.locationTypeFrom === "WAREHOUSEFROM") {
        const { error } = await supabase
            .from("warehouse_pieces")
            .update({
                amount: fromStock[0].amount - 1,
            })
            .eq("location", values.locationFrom)
            .eq("piece", values.piece)
            .throwOnError();
    }

    if (values.locationTypeTo === "MACHINETO") {
        if (toStock.length === 0) {
            const { error } = await supabase
                .from("machine_pieces")
                .insert([
                    {
                        piece: values.piece,
                        machine: values.locationTo,
                        amount: 1,
                    },
                ])
                .throwOnError();
        } else {
            const { error } = await supabase
                .from("machine_pieces")
                .update({
                    amount: toStock[0].amount + 1,
                })
                .eq("machine", values.locationTo)
                .eq("piece", values.piece)
                .throwOnError();
        }
    }

    if (values.locationTypeTo === "WAREHOUSETO") {
        if (toStock.length === 0) {
            const { error } = await supabase
                .from("warehouse_pieces")
                .insert([
                    {
                        piece: values.piece,
                        location: values.locationTo,
                        amount: 1,
                    },
                ])
                .throwOnError();
        } else {
            const { error } = await supabase
                .from("warehouse_pieces")
                .update({
                    amount: toStock[0].amount + 1,
                })
                .eq("location", values.locationTo)
                .eq("piece", values.piece)
                .throwOnError();
        }
    }

    insertRecentMovement(values);
}

export async function updatePiece({ values }) {
    const promiseToaster = toaster.create({
        title: "Modificando pieza...",
        description: "Por favor, espera mientras se modifica la pieza.",
        type: "loading",
    });

    try {
        const { error } = await supabase
            .from("Pieces")
            .update({
                brand: values.brand,
                type: values.type,
                description: values.description,
                buy_price: values.buyPrice,
                repair_price: repairPrice,
                supplier: values.supplier,
                alternative_piece: values.altPiece,
                status: values.status,
                additional_info: values.addInfo,
            })
            .throwOnError();

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
            description: "Ha ocurrido un error al modificar la pieza.",
            type: "error",
        });
    }
}

export async function addStockMenu({ values }) {
    
}
