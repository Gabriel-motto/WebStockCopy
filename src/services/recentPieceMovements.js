import supabase from "@/utils/supabase";

export async function getRecentPieceMovements(machine, piece, warehouse) {
    let query = supabase.from("Latest_piece_actions").select();

    if (machine !== "all") {
        query = query.eq("machine", machine);
    }

    if (piece) {
        query = query.ilike("piece", `%${piece}%`);
    }

    if (warehouse.length !== 0) {
        query = query.in("warehouse", warehouse);
    }

    console.log(query)

    return await query;
}
