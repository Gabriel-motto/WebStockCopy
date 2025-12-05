import { HintPanel } from "@/components/ui/HintPanel/HintPanel";
import { useMachines } from "@/hooks/useMachines";
import { useWarehouse } from "@/hooks/useWarehouse";
import { Button, QrCode, Separator } from "@chakra-ui/react";
import { useRef, useState } from "react";
import "./Menus.css";
import { useReactToPrint } from "react-to-print";
import { useUpdatePiece, useInsertPiece } from "@/hooks/usePieces";
import {
    useInsertPieceSerials,
    usePieceSerials,
    updatePieceSerials,
} from "@/hooks/usePieceSerials";
import { useClickAway } from "@uidotdev/usehooks";
import { IoIosArrowDown } from "react-icons/io";

export function MoveStockMenu({ piece, inStock, handleCancel }) {
    const [showHint1, setShowHint1] = useState(false);
    const [showHint2, setShowHint2] = useState(false);
    const [formData, setFormData] = useState({
        pieceId: piece?.id,
        location: "",
        serial: "",
        amount: 1,
        action: "move",
        note: null,
    });
    const pieceSerials = usePieceSerials({
        pieceId: piece?.id,
        search: formData.serial,
    });
    const machines = useMachines({
        search: formData.location,
    });
    const warehouses = useWarehouse({
        search: formData.location,
    });

    function handleSubmit(e) {
        e.preventDefault();
        formData.note &&
            (formData.note = `Movimiento de serial ${formData.serial} hacia ${formData.location}`);
        updatePieceSerials({
            values: formData,
            locationFrom: pieceSerials[0].current_machine
                ? pieceSerials[0].current_machine
                : pieceSerials[0].current_warehouse,
            isMachineFrom: pieceSerials[0].current_machine,
            locationTo: machines.length > 0 ? machines[0].id : warehouses[0].id,
            isMachineTo: machines.length > 0,
        });

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
        field === "serial"
            ? setFormData(
                  {
                      ...formData,
                      serial: value,
                  },
                  (document.getElementById("serial").value = value)
              )
            : setFormData(
                  {
                      ...formData,
                      location: value,
                  },
                  (document.getElementById("location").value = value)
              );
    }

    return (
        <div className="move-stock-container menus-container">
            <div className="body-move-stock">
                <form
                    className="move-form"
                    onSubmit={handleSubmit}
                >
                    <div className="move-menus-cage">
                        <div className="menus-cage serial-cage">
                            <p className="menus-label serial-label">
                                Serial a mover
                            </p>
                            <input
                                className="serial-input input"
                                type="text"
                                id="serial"
                                name="serial"
                                required
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
                                    hintData={pieceSerials.map(
                                        (item) => item.serial_code
                                    )}
                                    onSelect={(value) =>
                                        handleHintSelect(value, "serial")
                                    }
                                />
                            </div>
                        </div>

                        <div className="menus-cage location-cage">
                            <p className="menus-label location-label">
                                Localización final
                            </p>
                            <input
                                className="location-input input"
                                type="text"
                                id="location"
                                name="location"
                                required
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
                                    hintData={[...machines, ...warehouses].map(
                                        (item) => item.name
                                    )}
                                    onSelect={(value) =>
                                        handleHintSelect(value, "location")
                                    }
                                />
                            </div>
                        </div>
                        <div className="menus-cage note-cage">
                            <p className="menus-label note-label">
                                Nota (opcional)
                            </p>
                            <textarea
                                name="note"
                                id="note"
                                className="note-input input"
                                onChange={handleFormChange}
                                placeholder={`Movimiento de serial ${
                                    formData.serial ? formData.serial : "X"
                                } hacia ${
                                    formData.location ? formData.location : "X"
                                }`}
                            />
                        </div>
                    </div>
                    <div className="footer-move-stock menus-footer">
                        <Button
                            colorPalette="blue"
                            type="submit"
                        >
                            Aceptar
                        </Button>
                        <Button
                            colorPalette="red"
                            type="reset"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
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
                <div className="brand-edit-cage menus-cage">
                    <p className="brand-label menus-label">Marca</p>
                    <input
                        type="text"
                        name="brand"
                        id="brand"
                        className="input"
                        value={formData.brand}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="type-edit-cage menus-cage">
                    <p className="type-label menus-label">Tipo</p>
                    <input
                        type="text"
                        name="type"
                        id="type"
                        className="input"
                        value={formData.type}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="workshop-edit-cage menus-cage">
                    <p className="workshop-label menus-label">Taller</p>
                    <select
                        className="input"
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
                <div className="availability-edit-cage menus-cage">
                    <p className="availability-label menus-label">
                        Disponibilidad
                    </p>
                    <select
                        className="input"
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
                <div className="buy-price-edit-cage menus-cage">
                    <p className="buy-price-label menus-label">
                        Precio de compra
                    </p>
                    <input
                        className="input"
                        type="number"
                        name="buy_price"
                        id="buy_price"
                        value={formData.buy_price ? formData.buy_price : ""}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="repair-price-edit-cage menus-cage">
                    <p className="repair-price-label menus-label">
                        Precio de reparación
                    </p>
                    <input
                        className="input"
                        type="number"
                        name="repair_price"
                        id="repair_price"
                        value={
                            formData.repair_price ? formData.repair_price : ""
                        }
                        onChange={handleFormChange}
                    />
                </div>
                <div className="min-stock-edit-cage menus-cage">
                    <p className="minStock-label menus-label">Stock mínimo</p>
                    <input
                        className="input"
                        type="number"
                        id="min_stock"
                        name="min_stock"
                        onChange={handleFormChange}
                        value={formData.min_stock ? formData.min_stock : ""}
                    />
                </div>
                <div className="supplier-edit-cage menus-cage">
                    <p className="supplier-label menus-label">Proveedor</p>
                    <input
                        className="input"
                        type="text"
                        name="supplier"
                        id="supplier"
                        value={formData.supplier ? formData.supplier : ""}
                        onChange={handleFormChange}
                    />
                </div>
                <div className="alt-piece-edit-cage menus-cage">
                    <p className="alt-piece-label menus-label">
                        Pieza alternativa
                    </p>
                    <input
                        className="input"
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
                <div className="is-critical-edit-cage menus-cage">
                    <p className="is-critical-label menus-label">Es crítica</p>
                    <select
                        className="input"
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
                <div className="description-edit-cage menus-cage">
                    <p className="description-label menus-label">Descripción</p>
                    <textarea
                        className="input"
                        name="description"
                        id="description"
                        value={formData.description ? formData.description : ""}
                        onChange={handleFormChange}
                    ></textarea>
                </div>
                <div className="add-info-edit-cage menus-cage">
                    <p className="add-info-label menus-label">
                        Información adicional
                    </p>
                    <textarea
                        className="input"
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
                <div className="image-piece-edit-cage menus-cage">
                    <label
                        className="menus-label"
                        htmlFor="image-piece"
                    >
                        Imagen pieza
                    </label>
                    <input
                        className="image-input"
                        type="file"
                        name="pieceImage"
                        id="pieceImage"
                        onChange={handlePieceImageUpload}
                        accept="image/*"
                    />
                </div>
                <div className="image-data-card-edit-cage menus-cage">
                    <label
                        className="menus-label"
                        htmlFor="image-data-card"
                    >
                        Imagen etiqueta
                    </label>
                    <input
                        className="image-input"
                        type="file"
                        name="dataCard"
                        id="dataCard"
                        onChange={handleDataCardUpload}
                        accept="image/*"
                    />
                </div>
            </div>
            <div className="edit-footer menus-footer">
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
        pieceId: piece.id,
        amount: 1,
        action: "new",
        location: "",
        note: "",
    });
    const machines = useMachines({
        search: formData.location,
    });
    const warehouses = useWarehouse({
        search: formData.location,
    });

    function handleSubmit(e) {
        e.preventDefault();
        formData.note === "" &&
            (formData.note = `${piece.name} añadida al stock en ${formData.location}`);
        useInsertPieceSerials({
            values: formData,
            location: machines[0] ? machines[0].id : warehouses[0].id,
            isMachine: machines[0] ? true : false,
        });
        handleCancel();
    }

    function handleFormChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.toUpperCase(),
        });
    }

    function handleHintSelect(value) {
        setFormData(
            {
                ...formData,
                location: value,
            },
            (document.getElementById("location").value = value)
        );
    }

    return (
        <div className="add-menu-container menus-container">
            <div className="add-menu-body">
                <div className="location-cage menus-cage">
                    <p className="menus-label location-label">
                        Localización destino
                    </p>
                    <input
                        className="location-input input"
                        type="text"
                        id="location"
                        name="location"
                        required
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
                            hintData={[...machines, ...warehouses].map(
                                (item) => item.name
                            )}
                            onSelect={(value) => handleHintSelect(value)}
                        />
                    </div>
                </div>
                <div className="amount-cage menus-cage">
                    <p className="amount-label menus-label">Cantidad</p>
                    <input
                        className="input"
                        type="number"
                        min="1"
                        name="amount"
                        id="amount"
                        value={formData.amount}
                        onChange={handleFormChange}
                    />
                </div>
            </div>
            <div className="add-menu-footer menus-footer">
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
                            <p>
                                Serial: <br /> {serialSelected}
                            </p>
                            <p>
                                Ref: <br /> {piece.name}
                            </p>
                        </div>
                        <div className="print-brand">
                            <p>
                                Marca: <br /> {piece.brand}
                            </p>
                            <p>
                                Tipo: <br /> {piece.type}
                            </p>
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
            <div className="delete-menu-footer menus-footer">
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

export function NewPiece({ handleCancel }) {
    const [values, setValues] = useState({
        name: null,
        brand: null,
        type: null,
        workshop: "M",
        description: null,
        isCritical: false,
        repairPrice: null,
        buyPrice: null,
        supplier: null,
        availability: "available",
        minStock: null,
        altPiece: null,
        additionalInfo: null,
        action: "new",
        note: null,
        pieceImage: { path: null, file: null },
        dataCard: { path: null, file: null },
    });

    function handleSubmit(e) {
        e.preventDefault();
        values.note && (values.note = `Nueva pieza añadida: ${values.name}`);
        useInsertPiece(values);
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
        <div className="menus-container insert-container">
            <form
                onSubmit={handleSubmit}
                className="insert-piece-form"
            >
                <div className="menus-cage name-insert-cage">
                    <label
                        htmlFor="name"
                        className="menus-label"
                    >
                        Referencia
                    </label>
                    <input
                        className="input name-insert-input"
                        type="text"
                        id="name"
                        name="name"
                        required
                        onChange={handleFormChange}
                    />
                </div>
                <div className="menus-cage brand-insert-cage">
                    <label
                        htmlFor="brand"
                        className="menus-label"
                    >
                        Marca
                    </label>
                    <input
                        className="input brand-insert-input"
                        type="text"
                        id="brand"
                        name="brand"
                        required
                        onChange={handleFormChange}
                    />
                </div>
                <div className="menus-cage type-insert-cage">
                    <label
                        htmlFor="type"
                        className="menus-label"
                    >
                        Tipo
                    </label>
                    <input
                        className="input type-insert-input"
                        type="text"
                        id="type"
                        name="type"
                        onChange={handleFormChange}
                        required
                    />
                </div>
                <div className="menus-cage workshop-insert-cage">
                    <label
                        htmlFor="workshop"
                        className="menus-label"
                    >
                        Taller
                    </label>
                    <select
                        className="input workshop-insert-input"
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
                <div className="menus-cage isCritical-insert-cage">
                    <label
                        htmlFor="isCritical"
                        className="menus-label"
                    >
                        Es crítica
                    </label>
                    <select
                        className="input isCritical-insert-input"
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
                <div className="menus-cage description-insert-cage">
                    <label
                        htmlFor="description"
                        className="menus-label"
                    >
                        Descripción
                    </label>
                    <textarea
                        className="input description-insert-input"
                        id="description"
                        name="description"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="menus-cage repairPrice-insert-cage">
                    <label
                        htmlFor="repairPrice"
                        className="menus-label"
                    >
                        Precio de reparación
                    </label>
                    <input
                        className="input repairPrice-insert-input"
                        type="number"
                        id="repairPrice"
                        name="repairPrice"
                        step="0.01"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="menus-cage buyPrice-insert-cage">
                    <label
                        htmlFor="buyPrice"
                        className="menus-label"
                    >
                        Precio de compra
                    </label>
                    <input
                        className="input buyPrice-insert-input"
                        type="number"
                        id="buyPrice"
                        name="buyPrice"
                        step="0.01"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="menus-cage supplier-insert-cage">
                    <label
                        htmlFor="supplier"
                        className="menus-label"
                    >
                        Proveedor
                    </label>
                    <input
                        className="input supplier-insert-input"
                        type="text"
                        id="supplier"
                        name="supplier"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="menus-cage availability-insert-cage">
                    <label
                        htmlFor="availability"
                        className="menus-label"
                    >
                        Disponibilidad
                    </label>
                    <select
                        className="input availability-insert-input"
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
                <div className="menus-cage min-stock-insert-cage">
                    <label
                        htmlFor="minStock"
                        className="menus-label"
                    >
                        Stock mínimo
                    </label>
                    <input
                        className="input minStock-insert-input"
                        type="number"
                        id="minStock"
                        name="minStock"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="menus-cage altPiece-insert-cage">
                    <label
                        htmlFor="altPiece"
                        className="menus-label"
                    >
                        Pieza alternativa
                    </label>
                    <input
                        className="input altPiece-insert-input"
                        type="text"
                        id="altPiece"
                        name="altPiece"
                        onChange={handleFormChange}
                    />
                </div>
                <div className="menus-cage additionalInfo-insert-cage">
                    <label
                        htmlFor="additionalInfo"
                        className="menus-label"
                    >
                        Información adicional
                    </label>
                    <textarea
                        className="input additionalInfo-insert-input"
                        id="additionalInfo"
                        name="additionalInfo"
                        onChange={handleFormChange}
                    />
                </div>

                <div className="menus-cage image-piece-insert-cage">
                    <label
                        htmlFor="image-piece"
                        className="menus-label"
                    >
                        Imagen pieza
                    </label>
                    <input
                        className="image-input"
                        type="file"
                        name="pieceImage"
                        id="pieceImage"
                        onChange={handlePieceImageUpload}
                        accept="image/*"
                    />
                </div>
                <div className="menus-cage image-data-card-insert-cage">
                    <label
                        htmlFor="image-data-card"
                        className="menus-label"
                    >
                        Imagen etiqueta
                    </label>
                    <input
                        className="image-input"
                        type="file"
                        name="dataCard"
                        id="dataCard"
                        onChange={handleDataCardUpload}
                        accept="image/*"
                    />
                </div>
                <div className="menus-cage note-insert-cage">
                    <label htmlFor="note" className="menus-label">Nota (Opcional)</label>
                    <textarea type="text" name="note" id="note" className="input note-insert-input" />
                </div>
                <div className="menus-footer insert-menu-footer">
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
