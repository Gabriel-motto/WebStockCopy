import { toaster } from "@/components/ui/toaster";
import supabase from "@/utils/supabase";
import { Button } from "@chakra-ui/react";
import React, { useState } from "react";
import "./NewPiece.css";

export default function NewPiece({ handleCancel }) {
    const [values, setValues] = useState({
        name: null,
        brand: null,
        type: null,
        workshop: null,
        description: null,
        repairPrice: null,
        buyPrice: null,
        amount: null,
        supplier: null,
        altPiece: null,
        additionalInfo: null,
        locationType: "machine",
        location: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        // insertPiece();
        handleCancel();
    }

    function handleFormChange(e) {
        setValues({
            ...values,
            [e.target.name]: e.target.value.toUpperCase(),
        });
    }

    async function insertPiece() {
        const promiseToaster = toaster.create({
            title: "Añadiendo pieza...",
            description: "Por favor, espera mientras se añade la pieza.",
            type: "loading",
        });
        
        try {
            const { error } = await supabase
                .from("Pieces")
                .insert([
                    {
                        name: values.name,
                        brand: values.brand,
                        type: values.type,
                        workshop: values.workshop,
                        description: values.description,
                        buy_price: values.buyPrice,
                        repair_price: values.repairPrice,
                        supplier: values.supplier,
                        alternative_piece: values.altPiece,
                        additional_info: values.additionalInfo,
                    },
                ])
                .throwOnError();

            if (values.locationType === "machine") {
                insertPieceInMachine();
                const { error } = await supabase
                    .from("Latest_piece_actions")
                    .insert([
                        {
                            piece: values.name,
                            machine: values.location,
                            action: "INSERT",
                            amount: values.amount,
                        },
                    ])
                    .throwOnError();
            } else {
                insertPieceInWarehouse();
                const { error } = await supabase
                    .from("Latest_piece_actions")
                    .insert([
                        {
                            piece: values.name,
                            warehouse: values.location,
                            action: "INSERT",
                            amount: values.amount,
                        },
                    ])
                    .throwOnError();
            }

            toaster.dismiss(promiseToaster.id);
            toaster.create({
                title: "Pieza añadida",
                description: "La pieza se ha añadido correctamente.",
                type: "success",
            });

        } catch (error) {
            toaster.dismiss(promiseToaster.id);
            toaster.create({
                title: `Error ${error.code} al añadir pieza`,
                description: `${
                    error.code === "23505"
                        ? "La pieza ya existe."
                        : "Ha ocurrido un error al añadir la pieza."
                }`,
                type: "error",
            });
        }
    }

    async function insertPieceInMachine() {
        const { error } = await supabase
            .from("machine_pieces")
            .insert([
                {
                    piece: values.name,
                    machine: values.location,
                    amount: values.amount,
                },
            ])
            .throwOnError();
    }

    async function insertPieceInWarehouse() {
        const { error } = await supabase
            .from("Warehouse")
            .insert([
                {
                    piece: values.name,
                    location: values.location,
                    amount: values.amount,
                },
            ])
            .throwOnError();
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
                        defaultValue=""
                        onChange={handleFormChange}
                    >
                        <option
                            value=""
                            disabled
                        ></option>
                        <option
                            name="workshop"
                            value="Mecánica"
                        >
                            Mecánica
                        </option>
                        <option
                            name="workshop"
                            value="Electrónica"
                        >
                            Electrónica
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
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell buyPrice-cell">
                    <label htmlFor="buyPrice">Precio de compra</label>
                    <input
                        type="number"
                        id="buyPrice"
                        name="buyPrice"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell amount-cell">
                    <label htmlFor="amount">Cantidad</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        required
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
                <div className="cell location-cell">
                    <label htmlFor="location">
                        Ubicación
                        <input
                            className="location-radio"
                            type="radio"
                            name="locationType"
                            id="machine"
                            value="machine"
                            onChange={handleFormChange}
                            required
                        />
                        <label htmlFor="machine">Máquina</label>
                        <input
                            className="location-radio"
                            type="radio"
                            name="locationType"
                            id="warehouse"
                            value="warehouse"
                            onChange={handleFormChange}
                        />
                        <label htmlFor="warehouse">Almacén</label>
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        onChange={handleFormChange}
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
