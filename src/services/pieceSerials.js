import supabase from "@/utils/supabase";

export async function getPieceSerials(pieceId, column) {
    let query = supabase.from("piece_serials").select(column);

    if (pieceId) {
        query = query.ilike(pieceId);
    }

    const { data: pieceSerials } = await query;

    return pieceSerials;
}

export async function insertPieceSerials(pieceId, pieceStatus, location) {

    if (location.type === 'machine') {
        const { data: pieceSerial, error: insertError } = await supabase
        .from("piece_serials")
        .insert([
            {
                piece_id: pieceId,
                status: pieceStatus,
                current_machine: location.id
            }
        ])
    }

    if (location.type === 'warehouse') {
        const { data: pieceSerial, error: insertError } = await supabase
        .from("piece_serials")
        .insert([
            {
                piece_id: pieceId,
                status: pieceStatus,
                current_machine: location.id
            }
        ])
        .throwOnError();
    }
}