import supabase from "@/utils/supabase";

export async function getRecentPieceMovements(machine, piece, warehouse) {
    let query = supabase.from("piece_actions_new").select();

    if (machine !== "all") {
        query = query.eq("machine", machine);
    }

    if (piece) {
        query = query.ilike("piece", `%${piece}%`);
    }

    if (warehouse.length !== 0) {
        query = query.in("warehouse", warehouse);
    }

    return await query;
}
