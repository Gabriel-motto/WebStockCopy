import { HintPanel } from "@/components/ui/HintPanel/HintPanel";
import { useMachines } from "@/hooks/useMachines";
import { useWarehouse } from "@/hooks/useWarehouse";
import { Button, QrCode } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import "./Menus.css";
import { useReactToPrint } from "react-to-print";
import { useUpdatePiece } from "@/hooks/usePieces";

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

export function EditStockMenu({ pieceInfo, handleCancel, pieceImageOld, dataCardOld }) {
    const [formData, setFormData] = useState({
        ...pieceInfo,
        pieceImage: { path: "", file: null },
        dataCard: { path: "", file: null },
    });

    console.log("old", pieceImageOld, dataCardOld)

    function handleSubmit(e) {
        e.preventDefault();
        useUpdatePiece(formData, pieceImageOld.name, dataCardOld.name);
        console.log("menu", formData)
        handleCancel();
    }

    function handleFormChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    function handlePieceImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const extFromFile = file?.type?.split("/")?.pop() || "";
        const path = `${formData.name}.${extFromFile}`;

        setFormData({ ...formData, pieceImage: { path: path, file: file } });
    }

    function handleDataCardUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const extFromFile = file?.type?.split("/")?.pop() || "";
        const path = `${formData.name}-data-card.${extFromFile}`;

        setFormData({ ...formData, dataCard: { path: path, file: file } });
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
                        value={formData.brand}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="type-input input">
                    <p className="type-label menus-label">Tipo</p>
                    <input
                        type="text"
                        name="type"
                        id="type"
                        value={formData.type}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="workshop-input input">
                    <p className="workshop-label menus-label">Taller</p>
                    <select
                        name="workshop"
                        id="workshop"
                        value={formData.workshop}
                        onChange={handleFormChange}
                    >
                        <option
                            name="workshop"
                            value="E"
                        >
                            Eléctrico
                        </option>
                        <option
                            name="workshop"
                            value="M"
                        >
                            Mecánico
                        </option>
                    </select>
                </div>
                <div className="input availability-input">
                    <p className="availability-label menus-label">
                        Disponibilidad
                    </p>
                    <select
                        id="availability"
                        name="availability"
                        required
                        value={
                            formData.availability ? formData.availability : ""
                        }
                        onChange={handleFormChange}
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
                <div className="buy-price-input input">
                    <p className="buy-price-label menus-label">
                        Precio de compra
                    </p>
                    <input
                        type="number"
                        name="buy_price"
                        id="buy_price"
                        value={formData.buy_price ? formData.buy_price : ""}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="repair-price-input input">
                    <p className="repair-price-label menus-label">
                        Precio de reparación
                    </p>
                    <input
                        type="number"
                        name="repair_price"
                        id="repair_price"
                        value={
                            formData.repair_price ? formData.repair_price : ""
                        }
                        onChange={handleFormChange}
                    />
                </div>
                <div className="input min-stock-input">
                    <p className="minStock-label menus-label">Stock mínimo</p>
                    <input
                        type="number"
                        id="min_stock"
                        name="min_stock"
                        onChange={handleFormChange}
                        value={formData.min_stock ? formData.min_stock : ""}
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
                        name="alternative_piece"
                        id="alternative_piece"
                        value={
                            formData.alternative_piece
                                ? formData.alternative_piece
                                : ""
                        }
                        onChange={handleFormChange}
                    />
                </div>
                <div className="input is-critical-input">
                    <p className="is-critical-label menus-label">Es crítica</p>
                    <select
                        id="is_critical"
                        name="is_critical"
                        required
                        value={formData.is_critical}
                        onChange={handleFormChange}
                    >
                        <option
                            name="is_critical"
                            value={false}
                        >
                            No
                        </option>
                        <option
                            name="is_critical"
                            value={true}
                        >
                            Sí
                        </option>
                    </select>
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
                        name="additional_info"
                        id="additional_info"
                        value={
                            formData.additional_info
                                ? formData.additional_info
                                : ""
                        }
                        onChange={handleFormChange}
                    ></textarea>
                </div>
                <div className="input image-piece-input">
                    <label htmlFor="image-piece">Imagen pieza</label>
                    <input
                        type="file"
                        name="pieceImage"
                        id="pieceImage"
                        onChange={handlePieceImageUpload}
                        accept="image/*"
                    />
                </div>
                <div className="input image-data-card-input">
                    <label htmlFor="image-data-card">Imagen etiqueta</label>
                    <input
                        type="file"
                        name="dataCard"
                        id="dataCard"
                        onChange={handleDataCardUpload}
                        accept="image/*"
                    />
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
    const [locationId, setLocationId] = useState(null);
    const [formData, setFormData] = useState({
        piece: piece,
        locationTypeTo: "",
        locationTo: "",
        amount: 1,
        action: "new",
    });
    const machines = useMachines({
        search: formData.locationTo,
    });
    const warehouses = useWarehouse({
        search: formData.locationTo,
    });

    function handleSubmit(e) {
        e.preventDefault();
        handleCancel();
    }

    useEffect(() => {
        if (formData.locationTypeTo === "MACHINETO") {
            setLocationId(machines[0]?.id);
        } else {
            setLocationId(warehouses[0]?.id);
        }
    }, [formData.locationTo, machines, warehouses]);

    function handleFormChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.toUpperCase(),
        });
    }

    function handleHintSelect(value) {
        machines?.some((machine) => machine.name === value)
            ? ((document.getElementById("machineTo").checked = true),
              setFormData({
                  ...formData,
                  locationTypeTo: "MACHINETO",
                  locationTo: value,
              }))
            : ((document.getElementById("warehouseTo").checked = true),
              setFormData({
                  ...formData,
                  locationTypeTo: "WAREHOUSETO",
                  locationTo: value,
              }));
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
                            onSelect={(value) => handleHintSelect(value)}
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
