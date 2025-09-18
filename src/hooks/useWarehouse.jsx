import { getStockPieceFromWarehouse, getWarehouses } from "@/services/warehouse";
import { useEffect, useState } from "react";


export function useWarehouse(options = {}) {
    const { search = "", columns = "*" } = options;
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        getWarehouses(search, columns).then(setWarehouses);
    }, [search, columns]);

    return warehouses;
}

export function useStockPieceFromWarehouse(warehouse, piece) {
    const [stock, setStock] = useState();
    
    useEffect(() => {
        if (warehouse && piece) {
            getStockPieceFromWarehouse(warehouse, piece).then(setStock);
        }
    }, [warehouse, piece]);
    return stock;
}