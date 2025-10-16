import { useEffect, useState } from "react";
import { getMachinesStockPiece, getPieces, getTotalStockPiece, getWarehousesStockPiece, insertPiece, getImageName } from "../services/pieces";
import supabase from "@/utils/supabase";
import { toaster } from "@/components/ui/toaster";
import { useMachines, useSelectedMachine } from "./useMachines";
import { useWarehouse, useWarehouseStock } from "./useWarehouse";

export function usePieces(options = {}) {
    const {
        workshop = "all",
        search = "",
        multiple = [],
        debouncedSearch,
        column = "*",
        orderBy = {column: "is_critical", ascending: false},
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



export async function movePiece({ values }) {
    console.log(values);
//     const fromStock =
//         values.locationTypeFrom === "MACHINEFROM"
//             ? useSelectedMachineStock(values.locationFrom, values.piece)
//             : useStockPieceFromWarehouse(values.locationFrom, values.piece);
//     const toStock =
//         values.locationTypeTo === "MACHINETO"
//             ? useSelectedMachineStock(values.locationTo, values.piece)
//             : useStockPieceFromWarehouse(values.locationTo, values.piece);

//     if (values.locationTypeFrom === "MACHINEFROM") {
//         const { error } = await supabase
//             .from("machine_pieces")
//             .update({
//                 amount: fromStock[0].amount - 1,
//             })
//             .eq("machine", values.locationFrom)
//             .eq("piece", values.piece)
//             .throwOnError();
//     }

//     if (values.locationTypeFrom === "WAREHOUSEFROM") {
//         const { error } = await supabase
//             .from("warehouse_pieces")
//             .update({
//                 amount: fromStock[0].amount - 1,
//             })
//             .eq("location", values.locationFrom)
//             .eq("piece", values.piece)
//             .throwOnError();
//     }

//     if (values.locationTypeTo === "MACHINETO") {
//         if (toStock.length === 0) {
//             const { error } = await supabase
//                 .from("machine_pieces")
//                 .insert([
//                     {
//                         piece: values.piece,
//                         machine: values.locationTo,
//                         amount: 1,
//                     },
//                 ])
//                 .throwOnError();
//         } else {
//             const { error } = await supabase
//                 .from("machine_pieces")
//                 .update({
//                     amount: toStock[0].amount + 1,
//                 })
//                 .eq("machine", values.locationTo)
//                 .eq("piece", values.piece)
//                 .throwOnError();
//         }
//     }

//     if (values.locationTypeTo === "WAREHOUSETO") {
//         if (toStock.length === 0) {
//             const { error } = await supabase
//                 .from("warehouse_pieces")
//                 .insert([
//                     {
//                         piece: values.piece,
//                         location: values.locationTo,
//                         amount: 1,
//                     },
//                 ])
//                 .throwOnError();
//         } else {
//             const { error } = await supabase
//                 .from("warehouse_pieces")
//                 .update({
//                     amount: toStock[0].amount + 1,
//                 })
//                 .eq("location", values.locationTo)
//                 .eq("piece", values.piece)
//                 .throwOnError();
//         }
//     }

//     insertRecentMovement(values);
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
            title: `Error al modificar pieza`,
            description: "Ha ocurrido un error al modificar la pieza.",
            type: "error",
        });
    }
}

export async function useInsertStock( values, locationId ) {
    console.log(values);
    console.log(locationId);

    // const promiseToaster = toaster.create({
    //     title: "Modificando pieza...",
    //     description: "Por favor, espera mientras se modifica la pieza.",
    //     type: "loading",
    // });

    // if (values.locationTypeTo === "WAREHOUSETO") {
    //     console.log("a");
    //     const locationId = useWarehouse({search: values.locationTo});
    //     // const { error } = await supabase
    //     //     .from("warehouse_pieces_new")
    //     //     .upsert({
    //     //         piece: values.piece,
    //     //         location: locationId,
    //     //         amount: 1,
    //     //     })
    //     //     .throwOnError();
    // } else {
    //     // const { error } = await supabase
    //     //     .from("machine_pieces_new")
    //     //     .upsert({
    //     //         piece: values.piece,
    //     //         machine: values.locationTo,
    //     //         amount: 1,
    //     //     })
    //     //     .throwOnError();
    // }
    // try {
    //     toaster.dismiss(promiseToaster.id);
    //     toaster.create({
    //         title: "Pieza añadida",
    //         description: "La pieza se ha añadido correctamente.",
    //         type: "success",
    //     });
    // } catch (error) {
    //     toaster.dismiss(promiseToaster.id);
    //     toaster.create({
    //         title: `Error ${error.code} al añadir pieza`,
    //         description: "Ha ocurrido un error al añadir la pieza.",
    //         type: "error",
    //     });
    // }

    // insertRecentMovement(values);
}

export function useImageName(options = {}) {
    const { bucket = "pieces", baseName } = options;
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        getImageName(bucket, baseName).then(setImageUrl);
    }, [bucket, baseName]);
    
    return imageUrl;
}
