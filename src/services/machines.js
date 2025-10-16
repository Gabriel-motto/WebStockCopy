import supabase from "../utils/supabase";

export async function getMachines(selectedALines, search, column) {
    let query = supabase.from("machines_new").select(column);

    if (selectedALines.length > 0) {
        query = query.in("assembly_line_id", selectedALines);
    }

    if (search) {
        query = query.or(
            `name.ilike.%${search}%,description.ilike.%${search}%`
        );
    }

    const { data: machines } = await query;

    return machines;
}

export async function getPiecesFromMachines(machineId, column) {
    const { data: pieces } = await supabase
        .from("v_stock_machines")
        .select(column)
        .eq("machine_id", machineId);
    return pieces;
}
