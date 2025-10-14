import supabase from "../utils/supabase";

export async function getPieces(workshop, search, multiple, column, orderBy) {
    let query = supabase.from("pieces_new").select(column);

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

    if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending });
    }

    const { data: pieces } = await query;

    return pieces;
}

export async function getStockPiece(piece, column) {
    let query = supabase.from("v_stock_global").select(column).ilike("piece", `%${piece}%`);

    return await query;
}

export async function insertPiece(newPiece) {
    const { data: piece, error } = await supabase
            .from("pieces")
            .insert([
                {
                    name: newPiece.name,
                    type: newPiece.type,
                    brand: newPiece.brand,
                    description: newPiece.description,
                    is_critical: newPiece.isCritical,
                    workshop: newPiece.workshop,
                    buy_price: newPiece.buyPrice,
                    repair_price: newPiece.repairPrice,
                    supplier: newPiece.supplier,
                    alternative_piece: newPiece.altPiece,
                    additional_info: newPiece.additionalInfo,
                },
            ])
            .select("id")
            .throwOnError();

    // const {errorSerial} = await supabase.from("pieces_serials").insert([{
    //     piece: pieceId
    // }]) 
}