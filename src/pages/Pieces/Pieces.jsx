import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { Button, Input, InputGroup, CloseButton } from "@chakra-ui/react";
import { TabComponent } from "../../components/ui/tab-component.jsx";
import DialogComponent from "../../components/dialog/Dialog.jsx";
import { usePieces } from "../../hooks/usePieces";
import "./Pieces.css";
import PiecesDetails from "./PiecesDetails.jsx";
import PaginationControls from "@/components/ui/Pagination/Pagination";
import { IoSearch } from "react-icons/io5";
import { useDebounce } from "@uidotdev/usehooks";
import { EmptyError } from "@/components/ui/EmptyStates.jsx";
import { LoadingScreenHelix } from "@/components/loadingScreen/LoadingScreen.jsx";
import { navigateTo } from "@/utils/Link.jsx";
import { Toaster, toaster } from "@/components/ui/toaster.jsx";
import supabase from "@/utils/supabase.js";

const tabData = [
    {
        id: "all",
        title: "Todas",
    },
    {
        id: "Mecánica",
        title: "Mecánica",
    },
    {
        id: "Electrónica",
        title: "Electrónica",
    },
];

function NewPiece({ handleCancel }) {
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
            const { data, error } = await supabase
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
            ]).throwOnError();
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
                description: `${error.code === "23505" ? "La pieza ya existe." : "Ha ocurrido un error al añadir la pieza."}`,
                type: "error",
            });
        }
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
                        required
                        onChange={handleFormChange}
                    />
                </div>
                <div className="cell buyPrice-cell">
                    <label htmlFor="buyPrice">Precio de compra</label>
                    <input
                        type="number"
                        id="buyPrice"
                        name="buyPrice"
                        required
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
                        required
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
                        type="cancel"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </div>
    );
}

const CardComponent = lazy(() => import("../../components/card/Card.jsx"));

function PiecesPage({ params = {} }) {
    const [workshop, setWorkshop] = useState({ value: "all" });
    const [search, setSearch] = useState("");
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [selectedCardData, setSelectedCardData] = useState(null);
    const debouncedSearch = useDebounce(search, 300);
    const pieces = usePieces({
        workshop: workshop.value,
        search: search,
        debouncedSearch: debouncedSearch,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const siblings = 2; // Número de páginas antes y después de la actual
    const totalPages = Math.ceil(pieces.length / pageSize);

    // Si cambias páginaSize resetea a 1
    const handleSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    // Define slice
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pagedPieces = pieces.slice(start, end);

    // Open dialog if params.name is present
    useEffect(() => {
        if (params.name) {
            const found = pieces.find((p) => p.name === params.name);
            if (found) {
                setSelectedCardData(found);
                setShowDetailsDialog(true);
            }
        } else {
            setShowDetailsDialog(false);
        }
    }, [params.name, pieces]);

    // On card click, navigate to /pieces/:name
    const handleOnClickCard = (data) => {
        setSelectedCardData(data);
        setShowDetailsDialog(true);
        navigateTo(`/pieces/${encodeURIComponent(data.name)}`);
    };

    // When dialog closes, go back to /pieces
    const handleCloseDialog = () => {
        setShowNewDialog(false);
        setShowDetailsDialog(false);
        if (params.name) {
            navigateTo("/pieces");
        }
    };

    const handleWorkshopChange = (value) => {
        setWorkshop(value);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const inputRef = (useRef < HTMLInputElement) | (null > null);

    const endElement = search ? (
        <CloseButton
            size="xs"
            onClick={() => {
                setSearch("");
                inputRef.current?.focus();
            }}
            me="-2"
        />
    ) : null;

    return (
        <div className="container">
            <Toaster />
            <DialogComponent
                size="xl"
                title="Añadir pieza"
                content={<NewPiece handleCancel={handleCloseDialog} />}
                open={showNewDialog}
                close={handleCloseDialog}
                lazyMount
                placement="center"
                motionPreset="slide-in-bottom"
            />
            <div className="inner-header">
                <TabComponent
                    className="tab-compo"
                    tabContent={tabData}
                    defaultValue={"all"}
                    dataFromChild={handleWorkshopChange}
                />
                <div className="search-button">
                    <InputGroup
                        startElement={<IoSearch className="search-icon" />}
                        endElement={endElement}
                    >
                        <Input
                            className="search-machines"
                            placeholder="Buscar..."
                            variant="flushed"
                            value={search}
                            onChange={handleSearch}
                        />
                    </InputGroup>
                    <Button
                        className="dialog-button"
                        variant="ghost"
                        size="sm"
                        onClick={setShowNewDialog}
                    >
                        Añadir pieza
                    </Button>
                </div>
            </div>
            {totalPages !== 0 ? (
                <Suspense fallback={<LoadingScreenHelix />}>
                    <div className="grid-container">
                        {pagedPieces?.map((piece, index) => (
                            <CardComponent
                                className="card"
                                onClick={() => handleOnClickCard(piece)}
                                key={index}
                                title={piece.name}
                                image="/assets/GNK_logo_azul.png"
                                description={piece.description}
                                footer={piece.brand}
                                isCritical={piece.isCritical}
                                haveImage
                            />
                        ))}
                    </div>
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={handleSizeChange}
                        siblingCount={siblings}
                    />
                </Suspense>
            ) : search !== "" ? (
                <EmptyError description="No hay piezas que coincidan con la búsqueda" />
            ) : null}
            <DialogComponent
                size="cover"
                scrollBehavior="inside"
                title="Detalles de la pieza"
                content={
                    selectedCardData && (
                        <PiecesDetails data={selectedCardData} />
                    )
                }
                open={showDetailsDialog}
                close={handleCloseDialog}
                lazyMount
                placement="center"
                motionPreset="slide-in-bottom"
            />
        </div>
    );
}

export default PiecesPage;
