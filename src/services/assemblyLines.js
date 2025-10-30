import supabase from "../utils/supabase"

export async function getAssemblyLines( search ) {
    let query = supabase.from("assembly_lines_new").select();

    if(search !== "") {
        query = query.ilike("name", `%${search}%`);
    }

    const { data: aLines } = await query;

    return aLines;
}