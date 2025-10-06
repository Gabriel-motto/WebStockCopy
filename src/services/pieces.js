import supabase from "../utils/supabase";

export async function getPieces(workshop, search, multiple) {
    let query = supabase.from("Pieces").select();

    if (workshop !== "all") {
        query = query.eq("workshop", workshop);
    }

    if (multiple.length !== 0) {
        query = query.in("name", multiple);
    }

    if (search) {
        query = query.or(
            `name.ilike.%${search}%,description.ilike.%${search}%`
        );
    }

    const { data: pieces } = await query.order("is_critical", {
        ascending: false,
    });

    return pieces?.map((piece) => ({
        id: `${String(piece.id).padStart(6, "0")}${workshop === 'Electrónica' ? 'E' : 'M'}`,
        name: piece.name,
        description: piece.description,
        type: piece.type,
        brand: piece.brand,
        workshop: piece.workshop,
        isCritical: piece.is_critical,
        addInfo: piece.additional_info,
        supplier: piece.supplier,
        buyPrice: piece.buy_price,
        repairPrice: piece.repair_price,
        avaliability: piece.avaliability,
        minStock: piece.min_stock,
        altPiece: piece.alternative_piece,
    }));
}

export async function getStockPiece(piece) {
    let machineStock = await supabase
        .from("machine_pieces")
        .select()
        .ilike("piece", `${piece}`);
    let warehouseStock = await supabase
        .from("warehouse_pieces")
        .select()
        .ilike("piece", `${piece}`);

    return {
        machineStock: machineStock.data,
        warehouseStock: warehouseStock.data,
    };
}

// export async function getPiecesFromWarehouse(piece) {
//     let query = supabase.from("Warehouse").select();

//     if (piece !== "") {
//         query = query.eq("piece", `${piece}`);
//     }

//     const { data: pieces } = await query;

//     return pieces;
// }
