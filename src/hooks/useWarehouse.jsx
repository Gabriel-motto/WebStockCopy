import { getWarehouses, getWarehouseStock } from "@/services/warehouse";
import { useEffect, useState } from "react";

export function useWarehouse(options = {}) {
    const { search = "", column = "*", multipleId } = options;
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getWarehouses(search, column, multipleId).then((data) => {
            setWarehouses(data);
            setLoading(false);
        });
    }, [search, column, JSON.stringify(multipleId)]);
    return { warehouses, loading };
}

export function useWarehouseStock(options = {}) {
    const { warehouseId, column = "*" } = options;
    const [stock, setStock] = useState();

    useEffect(() => {
        getWarehouseStock(warehouseId, column).then(setStock);
    }, [warehouseId, column]);
    return stock;
}
