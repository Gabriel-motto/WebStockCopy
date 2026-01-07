import supabase from "@/utils/supabase";

export async function getRecentPieceMovements(machine, pieceId, warehouse, serial) {
    let query = supabase.from("piece_actions").select();

    if (machine !== "all") {
        query = query.eq("machine", machine);
    }

    if (pieceId) {
        query = query.eq("piece_id", pieceId);
    }

    if (warehouse) {
        query = query.eq("warehouse", warehouse);
    }

    if (serial) {
        query = query.ilike("piece_serial", `%${serial}%`);
    }

    return await query;
}

export async function insertRecentPieceMovementService(
    values,
    locationFrom,
    locationTo,
    isMachineFrom,
    isMachineTo
) {
    console.log(values);
    const { data: pieceMovement, error: insertError } = await supabase
        .from("piece_actions")
        .insert([
            {
                piece_id: values.pieceId,
                piece_serial: values.serial,
                action: values.action,
                note: values.note,
                warehouse_from: isMachineFrom ? null : locationFrom,
                warehouse_to: isMachineTo ? null : locationTo,
                machine_from: isMachineFrom ? locationFrom : null,
                machine_to: isMachineTo ? locationTo : null,
            },
        ]);
}
