import supabase from "@/utils/supabase";

export async function getWarehouses(search, column, multipleId) {
    let query = supabase.from("warehouses_new").select(column);

    if (search) {
        query = query.or(`name.ilike.%${search}%`);
    }

    if (multipleId && multipleId.length > 0) {
        query = query.in("id", multipleId);
    }

    const { data: warehouses } = await query;

    return warehouses;
}

export async function getWarehouseStock(warehouseId, column) {
    let query = supabase
        .from("v_stock_warehouses")
        .select(column)
        .eq("warehouse_id", warehouseId);

    const { data: stock } = await query;

    return stock;
}
