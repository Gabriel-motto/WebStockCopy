import supabase from "../utils/supabase";

export async function getMachines(selectedALines, search) {
    let query = supabase.from("Machines").select();

    if (selectedALines.length > 0) {
        query = query.in("assembly_line", selectedALines);
    }

    if (search) {
        query = query.or(
            `name.ilike.%${search}%,description.ilike.%${search}%`
        );
    }

    const { data: machines } = await query.order("assembly_line", {
        ascending: true,
    });

    return machines?.map((machine) => ({
        id: machine.id,
        name: machine.name,
        description: machine.description,
        aLine: machine.assembly_line,
    }));
}

export async function getPiecesFromMachines(machine) {
    const { data: pieces } = await supabase
        .from("machine_pieces")
        .select()
        .eq("machine", machine);
    return pieces;
}

export async function getStockPieceFromMachine(machine, piece) {
    const { data: stock } = await supabase
        .from("machine_pieces")
        .select()
        .eq("machine", machine)
        .eq("piece", piece);
    return stock;
}
