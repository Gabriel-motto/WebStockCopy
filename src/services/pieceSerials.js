import supabase from "@/utils/supabase";

export async function getPieceSerials(pieceId, column) {
    console.log("piece", pieceId)
    console.log("column", column)
    let query = supabase.from("piece_serials").select(column);


    if (pieceId) {
        query = query.eq("piece_id", pieceId);
    }

    const { data: pieceSerials } = await query;

    return pieceSerials;
}

export async function insertPieceSerials(values) {
    if (values.location.type === 'machine') {
        const { data: pieceSerial, error: insertError } = await supabase
        .from("piece_serials")
        .insert([
            {
                piece_id: values.piece,
                status: "active",
                current_machine: values.location.id.id
            }
        ])
    }

    if (values.location.type === 'warehouse') {
        const { data: pieceSerial, error: insertError } = await supabase
        .from("piece_serials")
        .insert([
            {
                piece_id: values.piece,
                status: "inactive",
                current_warehouse: values.location.id.id
            }
        ])
        .throwOnError();
    }
}