import { getStockPieceFromWarehouse, getWarehouses } from "@/services/warehouse";
import { useEffect, useState } from "react";


export function useWarehouse(search) {
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {
        getWarehouses(search).then(setWarehouses);
    }, [search]);

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