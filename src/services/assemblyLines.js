import supabase from "../utils/supabase"

export async function getAssemblyLines( search, id ) {
    let query = supabase.from("assembly_lines_new").select();

    if(search !== "") {
        query = query.ilike("name", `%${search}%`);
    }

    if(id) {
        query = query.eq("id", id);
    }

    const { data: aLines } = await query;

    return aLines;
}