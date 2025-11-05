import { useEffect, useState } from "react";
import { getAssemblyLines } from "../services/assemblyLines";

export function useAssemblyLines( options = {} ) {
    const { search = "", id } = options;
    const [assemblyLines, setAssemblyLines] = useState([]);

    useEffect(() => {
        getAssemblyLines(search, id).then(setAssemblyLines);
    }, [search, id]);
    
    return assemblyLines;
}