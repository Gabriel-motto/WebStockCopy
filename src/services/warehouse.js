import supabase from "@/utils/supabase";

export async function getWarehouses(search, columns) {
    let query = supabase.from("warehouses").select(columns);
    
    if (search) {
        query = query.ilike(
            "name", `%${search}%`
        );
    }

    const { data: warehouses } = await query;

    return warehouses;
}

export async function getStockPieceFromWarehouse(warehouse, piece) {
    let query = supabase
        .from("warehouse_pieces")
        .select("amount")
        .eq("location", warehouse)
        .eq("piece", piece);

    const { data: stock } = await query;

    return stock;
}
