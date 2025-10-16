import { toaster } from "@/components/ui/toaster";
import supabase from "@/utils/supabase";
import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import "./NewPiece.css";
import { useInsertPiece } from "@/hooks/usePieces";

export default function NewPiece({ handleCancel }) {
    const [values, setValues] = useState({
        name: null,
        brand: null,
        type: null,
        workshop: null,
        description: null,
        isCritical: null,
        repairPrice: null,
        buyPrice: null,
        supplier: null,
        availability: "available",
        minStock: null,
        altPiece: null,
        additionalInfo: null,
        action: "new",
        pieceImage: { path: null, file: null },
        dataCard: { path: null, file: null },
    });

    function handleSubmit(e) {
        e.preventDefault();
        useInsertPiece({ values });
        handleCancel();
    }

    function handleFormChange(e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    }

    function handlePieceImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const extFromFile = file?.type?.split("/")?.pop() || "";
        const path = `${values.name}.${extFromFile}`;

        setValues({ ...values, pieceImage: { path: path, file: file } });
    }

    function handleDataCardUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const extFromFile = file?.type?.split("/")?.pop() || "";
        const path = `${values.name}-data-card.${extFromFile}`;

        setValues({ ...values, dataCard: { path: path, file: file } });
    }

    return (
        <div className="form-container">
            <form
                onSubmit={handleSubmit}
                className="form"
            >
                <div className="cell name-cell">
                    <label htmlFor="name">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell brand-cell">
                    <label htmlFor="brand">Marca</label>
                    <input
                        type="text"
                        id="brand"
                        name="brand"
                        required
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell type-cell">
                    <label htmlFor="type">Tipo</label>
                    <input
                        type="text"
                        id="type"
                        name="type"
                        onChange={handleFormChange}
                        required
                    />
                </div>
                <div className="cell workshop-cell">
                    <label htmlFor="workshop">Taller</label>
                    <select
                        id="workshop"
                        name="workshop"
                        required
                        defaultValue="M"
                        onChange={handleFormChange}
                    >
                        <option
                            name="workshop"
                            value="M"
                        >
                            Mecánica
                        </option>
                        <option
                            name="workshop"
                            value="E"
                        >
                            Electrónica
                        </option>
                    </select>
                </div>
                <div className="cell isCritical-cell">
                    <label htmlFor="isCritical">Es crítica</label>
                    <select
                        id="isCritical"
                        name="isCritical"
                        required
                        defaultValue={false}
                        onChange={handleFormChange}
                    >
                        <option
                            name="isCritical"
                            value={false}
                        >
                            No
                        </option>
                        <option
                            name="isCritical"
                            value={true}
                        >
                            Sí
                        </option>
                    </select>
                </div>
                <div className="cell description-cell">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell repairPrice-cell">
                    <label htmlFor="repairPrice">Precio de reparación</label>
                    <input
                        type="number"
                        id="repairPrice"
                        name="repairPrice"
                        step="0.01"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell buyPrice-cell">
                    <label htmlFor="buyPrice">Precio de compra</label>
                    <input
                        type="number"
                        id="buyPrice"
                        name="buyPrice"
                        step="0.01"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell supplier-cell">
                    <label htmlFor="supplier">Proveedor</label>
                    <input
                        type="text"
                        id="supplier"
                        name="supplier"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell availability-cell">
                    <label htmlFor="availability">Disponibilidad</label>
                    <select
                        name="availability"
                        id="availability"
                        required
                        onChange={handleFormChange}
                        defaultValue="available"
                    >
                        <option
                            name="availability"
                            value="available"
                        >
                            Disponible
                        </option>
                        <option
                            name="availability"
                            value="obsolete"
                        >
                            Obsoleto
                        </option>
                        <option
                            name="availability"
                            value="unavailable"
                        >
                            No disponible
                        </option>
                        <option
                            name="availability"
                            value="limited"
                        >
                            Limitado
                        </option>
                    </select>
                </div>
                <div className="cell min-stock-cell">
                    <label htmlFor="minStock">Stock mínimo</label>
                    <input
                        type="number"
                        id="minStock"
                        name="minStock"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell altPiece-cell">
                    <label htmlFor="altPiece">Pieza alternativa</label>
                    <input
                        type="text"
                        id="altPiece"
                        name="altPiece"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell additionalInfo-cell">
                    <label htmlFor="additionalInfo">
                        Información adicional
                    </label>
                    <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        onChange={handleFormChange}
                    />
                </div>

                <div className="cell image-piece-cell">
                    <label htmlFor="image-piece">Imagen pieza</label>
                    <input
                        type="file"
                        name="pieceImage"
                        id="pieceImage"
                        onChange={handlePieceImageUpload}
                        accept="image/*"
                    />
                </div>
                <div className="cell image-data-card-cell">
                    <label htmlFor="image-data-card">Imagen etiqueta</label>
                    <input
                        type="file"
                        name="dataCard"
                        id="dataCard"
                        onChange={handleDataCardUpload}
                        accept="image/*"
                    />
                </div>
                <div className="cell form-buttons">
                    <Button
                        colorPalette="blue"
                        variant="outline"
                        type="submit"
                    >
                        Añadir
                    </Button>
                    <Button
                        colorPalette="red"
                        variant="outline"
                        type="reset"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}
