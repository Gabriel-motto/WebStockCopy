import { getWarehouses, getWarehouseStock } from "@/services/warehouse";
import { useEffect, useState } from "react";

export function useWarehouse(options = {}) {
    const { search = "", column = "*" } = options;
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        getWarehouses(search, column).then(setWarehouses);
    }, [search, column]);

    return warehouses;
}

export function useWarehouseStock(options = {}) {
    const { warehouseId, column = "*" } = options;
    const [stock, setStock] = useState();

    useEffect(() => {
        getWarehouseStock(warehouseId, column).then(setStock);
    }, [warehouseId, column]);
    return stock;
}
