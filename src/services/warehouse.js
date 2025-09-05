import supabase from "@/utils/supabase";

export async function getWarehouses(search) {
    let query = supabase.from("Warehouses").select();
    
    if (search) {
        query = query.ilike(
            "shelve", `%${search}%`
        );
    }

    const { data: warehouses } = await query.order("location", {
        ascending: true,
    });

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
