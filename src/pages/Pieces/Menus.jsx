import { HintPanel } from "@/components/ui/HintPanel/HintPanel";
import { useMachines } from "@/hooks/useMachines";
import { useWarehouse } from "@/hooks/useWarehouse";
import { Button, QrCode, Separator } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import "./Menus.css";
import { useReactToPrint } from "react-to-print";
import { useUpdatePiece } from "@/hooks/usePieces";
import {
    useInsertPieceSerials,
    usePieceSerials,
} from "@/hooks/usePieceSerials";
import { CustomSelect } from "@/components/ui/Select/Select";
import { useClickAway } from "@uidotdev/usehooks";
import { IoIosArrowDown } from "react-icons/io";

export function MoveStockMenu({ piece, inStock, handleCancel }) {
    const contentRef = useRef();
    const [serialSelected, setSerialSelected] = useState();
    const pieceSerials = usePieceSerials({
        pieceId: piece?.id,
    });
    const [showOptions, setShowOptions] = useState(false);
    const [showHint1, setShowHint1] = useState(false);
    const [showHint2, setShowHint2] = useState(false);
    const [formData, setFormData] = useState({
        piece: piece?.name,
        locationTypeFrom: "",
        locationFrom: "",
        location: { id: "", type: "" },
        amount: 1,
        action: "move",
    });
    const machines = useMachines({
        search: formData.location.id,
    });
    const warehouses = useWarehouse({
        search: formData.location.id,
    });

    const ref = useClickAway(() => {
        setShowOptions(false);
    });

    function handleSubmit(e) {
        e.preventDefault();
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
            [field]: value.name,
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
        <div className="move-stock-container menus-container">
            <div className="body-move-stock">
                <form
                    className="move-form"
                    onSubmit={handleSubmit}
                >
                    <div className="move-location-cell">
                        <div className="print-menu-selector">
                            <div
                                ref={ref}
                                className="custom-select-container"
                                onClick={() => setShowOptions(!showOptions)}
                            >
                                <div className="custom-selector">
                                    <p className="selector-label">
                                        Selecciona la/s pieza/s a mover
                                    </p>
                                    <Separator
                                        orientation="vertical"
                                        height="5"
                                        size="md"
                                    />
                                    <IoIosArrowDown />
                                </div>
                                <div
                                    className={`${
                                        showOptions
                                            ? "custom-options show"
                                            : "custom-options"
                                    }`}
                                >
                                    {pieceSerials?.map((item, index) => (
                                        <div
                                            className={"custom-item"}
                                            key={index}
                                            onClick={() => {
                                                setSerialSelected(
                                                    item.serial_code
                                                );
                                                setShowOptions(false);
                                            }}
                                        >
                                            {item.serial_code}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="location location.id">
                            <div>
                                <p className="title-label menus-label">A</p>
                                <input
                                    className="location-radio"
                                    type="radio"
                                    name="location.type"
                                    id="machineTo"
                                    value="machineTo"
                                    onChange={handleFormChange}
                                    required
                                />
                                <label htmlFor="machineTo">Máquina</label>
                                <input
                                    className="location-radio"
                                    type="radio"
                                    name="location.type"
                                    id="warehouseTo"
                                    value="warehouseTo"
                                    onChange={handleFormChange}
                                />
                                <label htmlFor="warehouseTo">Almacén</label>
                            </div>
                            <input
                                className="location-input"
                                type="text"
                                id="location.id"
                                name="location.id"
                                required
                                value={formData.location.id}
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
                                        handleHintSelect(value, "location.id")
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

export function EditStockMenu({
    pieceInfo,
    handleCancel,
    pieceImageOld,
    dataCardOld,
}) {
    const [formData, setFormData] = useState({
        ...pieceInfo,
        pieceImage: { path: "", file: null },
        dataCard: { path: "", file: null },
    });

    function handleSubmit(e) {
        e.preventDefault();
        useUpdatePiece(formData, pieceImageOld?.name, dataCardOld?.name);
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
        <div className="edit-menu-container menus-container">
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
    const [formData, setFormData] = useState({
        piece: piece.id,
        location: { id: "", type: "" },
        amount: 1,
        action: "new",
        locationId: "",
    });
    const machines = useMachines({
        search: formData.locationId,
    });
    const warehouses = useWarehouse({
        search: formData.locationId,
    });

    function handleSubmit(e) {
        e.preventDefault();
        useInsertPieceSerials(formData);
        handleCancel();
    }

    function handleFormChange(e) {
        if (e.target.name === "locationId") {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value.toUpperCase(),
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value.toUpperCase(),
            });
        }
    }

    function handleHintSelect(value) {
        machines?.some((machine) => machine.name === value.name)
            ? ((document.getElementById("machineTo").checked = true),
              setFormData({
                  ...formData,
                  location: { id: value, type: "machine" },
              }))
            : ((document.getElementById("warehouseTo").checked = true),
              setFormData({
                  ...formData,
                  location: { id: value, type: "warehouse" },
              }));
    }

    return (
        <div className="add-menu-container menus-container">
            <div className="add-menu-body">
                <div className="location input">
                    <div className="input-radio">
                        <p className="title-label menus-label">A</p>
                        <input
                            className="location-radio"
                            type="radio"
                            id="machineTo"
                            value="machineTo"
                            onChange={handleFormChange}
                            required
                        />
                        <label htmlFor="machineTo">Máquina</label>
                        <input
                            className="location-radio"
                            type="radio"
                            id="warehouseTo"
                            value="warehouseTo"
                            onChange={handleFormChange}
                        />
                        <label htmlFor="warehouseTo">Almacén</label>
                    </div>
                    <input
                        className="location-input add-input"
                        type="text"
                        id="locationId"
                        name="locationId"
                        required
                        value={formData.location.id.name}
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
    const [serialSelected, setSerialSelected] = useState();
    const pieceSerials = usePieceSerials({
        pieceId: piece?.id,
    });
    const [showOptions, setShowOptions] = useState(false);

    const ref = useClickAway(() => {
        setShowOptions(false);
    });

    return (
        <div className="print-menu-container menus-container">
            <div className="print-menu-selector">
                <div
                    ref={ref}
                    className="custom-select-container"
                    onClick={() => setShowOptions(!showOptions)}
                >
                    <div className="custom-selector">
                        <p className="selector-label">Selecciona una opción</p>
                        <Separator
                            orientation="vertical"
                            height="5"
                            size="md"
                        />
                        <IoIosArrowDown />
                    </div>
                    <div
                        className={`${
                            showOptions
                                ? "custom-options show"
                                : "custom-options"
                        }`}
                    >
                        {pieceSerials?.map((item, index) => (
                            <div
                                className={"custom-item"}
                                key={index}
                                onClick={() => {
                                    setSerialSelected(item.serial_code);
                                    setShowOptions(false);
                                }}
                            >
                                {item.serial_code}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div
                className={`${
                    serialSelected ? "print-menu-body show" : "print-menu-body"
                }`}
            >
                <div
                    ref={contentRef}
                    className="print-content"
                >
                    <QrCode.Root
                        className="qr-code"
                        size="sm"
                        value={`https://web-stock-peach.vercel.app/pieces/${piece.name}`}
                    >
                        <QrCode.Frame>
                            <QrCode.Pattern />
                        </QrCode.Frame>
                    </QrCode.Root>
                    <div className="print-info">
                        <div className="print-serial">

                        <p>Serial: <br/> {serialSelected}</p>
                        <p>Ref: <br/> {piece.name}</p>
                        </div>
                        <div className="print-brand">

                        <p>Marca: <br/> {piece.brand}</p>
                        <p>Tipo: <br/> {piece.type}</p>
                        </div>
                    </div>
                </div>
                <Button
                    colorPalette="blue"
                    onClick={reactToPrintFn}
                >
                    Imprimir etiqueta
                </Button>
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
        <div className="delete-stock-container menus-container">
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
