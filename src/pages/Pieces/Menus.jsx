import { HintPanel } from "@/components/ui/HintPanel/HintPanel";
import { useMachines } from "@/hooks/useMachines";
import { useWarehouse } from "@/hooks/useWarehouse";
import { Button, QrCode } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./Menus.css";
import { useReactToPrint } from "react-to-print";

export function MoveStockMenu({ piece, inStock, handleCancel }) {
    const [showHint1, setShowHint1] = useState(false);
    const [showHint2, setShowHint2] = useState(false);
    const [formData, setFormData] = useState({
        piece: piece,
        locationTypeFrom: "",
        locationFrom: "",
        locationTypeTo: "",
        locationTo: "",
        amount: 1,
        action: "move",
    });
    const machines = useMachines({
        search: formData.locationTo,
        columns: "name",
    });
    const warehouses = useWarehouse({
        search: formData.locationTo,
        columns: "name",
    });

    function handleSubmit(e) {
        e.preventDefault();
        console.log(formData);
        handleCancel();
    }

    function handleFocus(op) {
        op === 1 ? setShowHint1(true) : setShowHint2(true);
    }

    function handleBlur(op) {
        op === 1 ? setShowHint1(false) : setShowHint2(false);
    }

    function handleFormChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.toUpperCase(),
        });
    }

    function handleHintSelect(value, field) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        field === "locationFrom"
            ? machines?.some((machine) => machine.name === value)
                ? (document.getElementById("machineFrom").checked = true)
                : (document.getElementById("warehouseFrom").checked = true)
            : machines?.some((machine) => machine.name === value)
            ? (document.getElementById("machineTo").checked = true)
            : (document.getElementById("warehouseTo").checked = true);
    }

    return (
        <div className="move-stock-container container">
            <div className="body-move-stock">
                <form
                    className="move-form"
                    onSubmit={handleSubmit}
                >
                    <div className="move-location-cell">
                        <div className="location locationFrom">
                            <div>
                                <p className="title-label menus-label">De</p>
                                <input
                                    className="location-radio"
                                    type="radio"
                                    name="locationTypeFrom"
                                    id="machineFrom"
                                    value="machineFrom"
                                    onChange={handleFormChange}
                                    required
                                    disabled
                                />
                                <label htmlFor="machineFrom">Máquina</label>
                                <input
                                    className="location-radio"
                                    type="radio"
                                    name="locationTypeFrom"
                                    id="warehouseFrom"
                                    value="warehouseFrom"
                                    onChange={handleFormChange}
                                />
                                <label htmlFor="warehouseFrom">Almacén</label>
                            </div>
                            <input
                                className="location-input"
                                type="text"
                                id="locationFrom"
                                name="locationFrom"
                                required
                                value={formData.locationFrom}
                                onChange={handleFormChange}
                                onFocus={() => handleFocus(1)}
                                onBlur={() => handleBlur(1)}
                            />
                            <div
                                className={`${
                                    showHint1 ? "autofiller show" : "autofiller"
                                }`}
                            >
                                <HintPanel
                                    hintData={inStock}
                                    onSelect={(value) =>
                                        handleHintSelect(value, "locationFrom")
                                    }
                                />
                            </div>
                        </div>

                        <div className="location locationTo">
                            <div>
                                <p className="title-label menus-label">A</p>
                                <input
                                    className="location-radio"
                                    type="radio"
                                    name="locationTypeTo"
                                    id="machineTo"
                                    value="machineTo"
                                    onChange={handleFormChange}
                                    required
                                />
                                <label htmlFor="machineTo">Máquina</label>
                                <input
                                    className="location-radio"
                                    type="radio"
                                    name="locationTypeTo"
                                    id="warehouseTo"
                                    value="warehouseTo"
                                    onChange={handleFormChange}
                                />
                                <label htmlFor="warehouseTo">Almacén</label>
                            </div>
                            <input
                                className="location-input"
                                type="text"
                                id="locationTo"
                                name="locationTo"
                                required
                                value={formData.locationTo}
                                onChange={handleFormChange}
                                onFocus={() => handleFocus(2)}
                                onBlur={() => handleBlur(2)}
                            />
                            <div
                                className={`${
                                    showHint2 ? "autofiller show" : "autofiller"
                                }`}
                            >
                                <HintPanel
                                    hintData={[...machines, ...warehouses]}
                                    onSelect={(value) =>
                                        handleHintSelect(value, "locationTo")
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="footer-move-stock footer">
                <Button
                    colorPalette="blue"
                    onClick={handleSubmit}
                >
                    Aceptar
                </Button>
                <Button
                    colorPalette="red"
                    onClick={handleCancel}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
}

export function EditStockMenu({ pieceInfo, handleCancel }) {
    const [formData, setFormData] = useState(pieceInfo);

    function handleSubmit(e) {
        e.preventDefault();
        handleCancel();
    }

    function handleFormChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.toUpperCase(),
        });
        console.log(e.target.value.toUpperCase());
    }

    return (
        <div className="edit-menu-container container">
            <div className="edit-body">
                <div className="brand-input input">
                    <p className="brand-label menus-label">Marca</p>
                    <input
                        type="text"
                        name="brand"
                        id="brand"
                        value={formData.brand ? formData.brand : ""}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="type-input input">
                    <p className="type-label menus-label">Tipo</p>
                    <input
                        type="text"
                        name="type"
                        id="type"
                        value={formData.type ? formData.type : ""}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="buy-price-input input">
                    <p className="buy-price-label menus-label">
                        Precio de compra
                    </p>
                    <input
                        type="number"
                        name="buy-price"
                        id="buy-price"
                        value={formData.buyPrice ? formData.buyPrice : ""}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="repair-price-input input">
                    <p className="repair-price-label menus-label">
                        Precio de reparación
                    </p>
                    <input
                        type="number"
                        name="repair-price"
                        id="repair-price"
                        value={formData.repairPrice ? formData.repairPrice : ""}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="supplier-input input">
                    <p className="supplier-label menus-label">Proveedor</p>
                    <input
                        type="text"
                        name="supplier"
                        id="supplier"
                        value={formData.supplier ? formData.supplier : ""}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="alt-piece-input input">
                    <p className="alt-piece-label menus-label">
                        Pieza alternativa
                    </p>
                    <input
                        type="text"
                        name="altPiece"
                        id="alt-piece"
                        value={formData.altPiece ? formData.altPiece : ""}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="status-input input">
                    <p className="status-label menus-label">Estado</p>
                    <input
                        type="text"
                        name="status"
                        id="status"
                        value={formData.status ? formData.status : ""}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="description-input input">
                    <p className="description-label menus-label">Descripción</p>
                    <textarea
                        name="description"
                        id="description"
                        value={formData.description ? formData.description : ""}
                        onChange={handleFormChange}
                    ></textarea>
                </div>
                <div className="add-info-input input">
                    <p className="add-info-label menus-label">
                        Información adicional
                    </p>
                    <textarea
                        name="addInfo"
                        id="add-info"
                        value={formData.addInfo ? formData.addInfo : ""}
                        onChange={handleFormChange}
                    ></textarea>
                </div>
            </div>
            <div className="edit-footer footer">
                <Button
                    colorPalette="blue"
                    onClick={handleSubmit}
                >
                    Aceptar
                </Button>
                <Button
                    colorPalette="red"
                    onClick={handleCancel}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
}

export function AddStockMenu({ piece, handleCancel }) {
    const [showHint, setShowHint] = useState(false);
    const [formData, setFormData] = useState({
        piece: piece,
        locationTypeTo: "",
        locationTo: "",
        amount: 1,
        action: "new",
    });
    const machines = useMachines({
        search: formData.locationTo,
        columns: "name",
    });
    const warehouses = useWarehouse({
        search: formData.locationTo,
        columns: "name",
    });

    function handleSubmit(e) {
        e.preventDefault();
        handleCancel();
    }

    function handleFormChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.toUpperCase(),
        });
        console.log(e.target.value.toUpperCase());
    }

    function handleHintSelect(value, field) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        machines?.some((machine) => machine.name === value)
            ? (document.getElementById("machineTo").checked = true)
            : (document.getElementById("warehouseTo").checked = true);
    }

    return (
        <div className="add-menu-container container">
            <div className="add-menu-body">
                <div className="location input">
                    <div className="input-radio">
                        <p className="title-label menus-label">A</p>
                        <input
                            className="location-radio"
                            type="radio"
                            name="locationTypeTo"
                            id="machineTo"
                            value="machineTo"
                            onChange={handleFormChange}
                            required
                        />
                        <label htmlFor="machineTo">Máquina</label>
                        <input
                            className="location-radio"
                            type="radio"
                            name="locationTypeTo"
                            id="warehouseTo"
                            value="warehouseTo"
                            onChange={handleFormChange}
                        />
                        <label htmlFor="warehouseTo">Almacén</label>
                    </div>
                    <input
                        className="location-input add-input"
                        type="text"
                        id="locationTo"
                        name="locationTo"
                        required
                        value={formData.locationTo}
                        onChange={handleFormChange}
                        onFocus={() => setShowHint(true)}
                        onBlur={() => setShowHint(false)}
                    />
                    <div
                        className={`${
                            showHint ? "autofiller show" : "autofiller"
                        }`}
                    >
                        <HintPanel
                            hintData={[...machines, ...warehouses]}
                            onSelect={(value) =>
                                handleHintSelect(value, "locationTo")
                            }
                        />
                    </div>
                </div>
                <div className="amount-input input">
                    <p className="amount-label menus-label">Cantidad</p>
                    <input
                        type="number"
                        min="1"
                        name="amount"
                        id="amount"
                        value={formData.amount}
                        onChange={handleFormChange}
                    />
                </div>
            </div>
            <div className="add-menu-footer footer">
                <Button
                    colorPalette="blue"
                    onClick={handleSubmit}
                >
                    Aceptar
                </Button>
                <Button
                    colorPalette="red"
                    onClick={handleCancel}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
}

export function PrintMenu({ piece, inStock, handleCancel }) {
    const contentRef = useRef();
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <div className="print-menu-container container">
            <div className="print-menu-body">
                <Button
                    colorPalette="blue"
                    onClick={reactToPrintFn}
                >
                    Imprimir etiqueta
                </Button>
                <div
                    ref={contentRef}
                    className="print-content"
                >
                    <QrCode.Root
                        className="qr-code"
                        value={`https://web-stock-peach.vercel.app/pieces/${piece}`}
                    >
                        <QrCode.Frame>
                            <QrCode.Pattern />
                        </QrCode.Frame>
                    </QrCode.Root>
                    <div className="print-info">
                        <p>ID: {piece.id}</p>
                        <p>Ref: {piece.name}</p>
                        <p>Marca: {piece.brand}</p>
                        <p>Tipo: {piece.type}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DeleteStockMenu({ piece, inStock, handleCancel }) {
    const [showHint, setShowHint] = useState(false);
    const [formData, setFormData] = useState({
        piece: piece,
        locationTypeFrom: "",
        locationFrom: "",
        amount: 1,
        action: "add",
    });
    const machines = useMachines({
        columns: "name",
    });

    function handleSubmit(e) {
        e.preventDefault();
        handleCancel();
    }

    function handleFormChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.toUpperCase(),
        });
        console.log(e.target.value.toUpperCase());
    }

    function handleHintSelect(value, field) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        machines?.some((machine) => machine.name === value)
            ? (document.getElementById("machineFrom").checked = true)
            : (document.getElementById("warehouseFrom").checked = true);
    }

    return (
        <div className="delete-stock-container container">
            <div className="delete-menu-body">
                <div className="location locationFrom">
                    <label>
                        <p className="title-label menus-label">De</p>
                        <input
                            className="location-radio"
                            type="radio"
                            name="locationTypeFrom"
                            id="machineFrom"
                            value="machineFrom"
                            onChange={handleFormChange}
                            required
                        />
                        <label htmlFor="machineFrom">Máquina</label>
                        <input
                            className="location-radio"
                            type="radio"
                            name="locationTypeFrom"
                            id="warehouseFrom"
                            value="warehouseFrom"
                            onChange={handleFormChange}
                        />
                        <label htmlFor="warehouseFrom">Almacén</label>
                    </label>
                    <input
                        className="location-input"
                        type="text"
                        id="locationFrom"
                        name="locationFrom"
                        required
                        value={formData.locationFrom}
                        onChange={handleFormChange}
                        onFocus={() => setShowHint(true)}
                        onBlur={() => setShowHint(false)}
                    />
                    <div
                        className={`${
                            showHint ? "autofiller show" : "autofiller"
                        }`}
                    >
                        <HintPanel
                            hintData={inStock}
                            onSelect={(value) =>
                                handleHintSelect(value, "locationFrom")
                            }
                        />
                    </div>
                </div>
                <div className="amount-input input">
                    <p className="amount-label menus-label">Cantidad</p>
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        min="1"
                        value={formData.amount}
                        onChange={handleFormChange}
                    />
                </div>
            </div>
            <div className="delete-menu-footer footer">
                <Button
                    colorPalette="blue"
                    onClick={handleSubmit}
                >
                    Enviar petición
                </Button>
                <Button
                    colorPalette="red"
                    onClick={handleCancel}
                >
                    Cancelar
                </Button>
            </div>
        </div>
    );
}
