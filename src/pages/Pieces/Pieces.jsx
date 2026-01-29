import { useState, lazy, Suspense, useRef, useEffect } from "react";
import {
    Button,
    Input,
    InputGroup,
    CloseButton,
    Table,
} from "@chakra-ui/react";
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
import { MdSearchOff } from "react-icons/md";
import { NewPiece } from "./Menus.jsx";
import { CustomSelect } from "@/components/ui/Select/Select.jsx";
import { useReactToPrint } from "react-to-print";
import { usePieceSerials } from "@/hooks/usePieceSerials.jsx";
import { useMachines } from "@/hooks/useMachines.jsx";
import { useWarehouse } from "@/hooks/useWarehouse.jsx";

const tabData = [
    {
        id: "all",
        title: "Todas",
    },
    {
        id: "M",
        title: "Mecánica",
    },
    {
        id: "E",
        title: "Electrónica",
    },
];

const CardComponent = lazy(() => import("../../components/card/Card.jsx"));

function PrintPiecesList({
    contentRef,
    pieces,
    reactToPrintFn,
    isPrinting,
    setIsPrinting,
}) {
    useEffect(() => {
        if (isPrinting) {
            reactToPrintFn();
            setIsPrinting(false);
        }
    }, [isPrinting, reactToPrintFn, setIsPrinting]);

    return (
        <div
            ref={contentRef}
            className="piece-list-print"
        >
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Referencia</Table.ColumnHeader>
                        <Table.ColumnHeader>Marca</Table.ColumnHeader>
                        <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                        <Table.ColumnHeader>Precio compra</Table.ColumnHeader>
                        <Table.ColumnHeader>
                            Precio reparacion
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>Proveedor</Table.ColumnHeader>
                        <Table.ColumnHeader>Alternativa</Table.ColumnHeader>
                        <Table.ColumnHeader>Referenciada</Table.ColumnHeader>
                        <Table.ColumnHeader>Crítica</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {pieces.map((piece, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{piece.name}</Table.Cell>
                            <Table.Cell>{piece.brand || "N/A"}</Table.Cell>
                            <Table.Cell>{piece.type || "N/A"}</Table.Cell>
                            <Table.Cell>{piece.buy_price || "N/A"}</Table.Cell>
                            <Table.Cell>
                                {piece.repair_price || "N/A"}
                            </Table.Cell>
                            <Table.Cell>{piece.supplier || "N/A"}</Table.Cell>
                            <Table.Cell>
                                {piece.alternative_piece || "N/A"}
                            </Table.Cell>
                            <Table.Cell>
                                {piece.ref_piece || "Sin referenciar"}
                            </Table.Cell>
                            <Table.Cell>
                                {piece.is_critical ? "Sí" : "No"}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    );
}

function PrintPiecesMachinesList({
    contentRef,
    pieces,
    reactToPrintFn,
    isPrinting,
    setIsPrinting,
}) {
    const [isLoadingData, setIsLoadingData] = useState(true);
    const { serials: pieceSerials, loading: loadingSerials } = usePieceSerials({
        multipleId: pieces.map((p) => p.id),
        column: "piece_id, current_machine, current_warehouse",
    });
    const { machines, loading: loadingMachines } = useMachines({
        multipleId: pieceSerials.filter((s) => s.current_machine !== null).map((s) => s.current_machine),
        column: "id, name",
    });
    const filteredMachines = machines.filter((m) =>
        pieceSerials
            .filter((s) => pieces.map((p) => p.id).includes(s.piece_id))
            .map((s) => s.current_machine)
            .includes(m.id),
    );

    useEffect(() => {
        if (filteredMachines.length > 0) {
            setIsLoadingData(false);
        }
    }, [filteredMachines]);

    useEffect(() => {
        if (
            isPrinting &&
            !loadingSerials &&
            !loadingMachines &&
            !isLoadingData
        ) {
            reactToPrintFn();
            setIsPrinting(false);
        }
    }, [
        isPrinting,
        reactToPrintFn,
        setIsPrinting,
        loadingSerials,
        loadingMachines,
        isLoadingData,
    ]);

    return (
        <div
            ref={contentRef}
            className="piece-machine-list-print"
        >
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>
                            Referencia pieza
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                            Cantidad en total
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                            Instalada en
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {pieces.map((piece, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{piece.name}</Table.Cell>
                            <Table.Cell textAlign="center">
                                {
                                    pieceSerials.filter(
                                        (s) => s.piece_id === piece.id,
                                    ).length
                                }
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                {filteredMachines
                                    .filter((m) =>
                                        pieceSerials
                                            .filter(
                                                (s) => s.piece_id === piece.id,
                                            )
                                            .map((s) => s.current_machine)
                                            .includes(m.id),
                                    )
                                    .map((m) => m.name)
                                    .join(", ")}
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    );
}

export default function PiecesPage({ params = {} }) {
    const [workshop, setWorkshop] = useState({ value: "all" });
    const [search, setSearch] = useState("");
    const [showNewDialog, setShowNewDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [selectedCardData, setSelectedCardData] = useState(null);
    const debouncedSearch = useDebounce(search, 300);
    const [selectedFilterValue, setSelectedFilterValue] = useState(null);
    const [getCriticals, setGetCriticals] = useState(false);
    const pieces = usePieces({
        workshop: workshop.value,
        search: search,
        debouncedSearch: debouncedSearch,
        filter: selectedFilterValue,
        getCriticals: getCriticals,
        orderBy: { column: "name", ascending: true },
    });
    const contentRef = useRef();
    const reactToPrintFn = useReactToPrint({ contentRef });
    const [isPrinting, setIsPrinting] = useState(false);
    const [isPrintingPieceMachines, setIsPrintingPieceMachines] =
        useState(false);
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

    function handleSelectClick(value) {
        value === selectedFilterValue
            ? setSelectedFilterValue(null)
            : setSelectedFilterValue(value);
    }

    function handleSelectPrint(value) {
        value === "pieces"
            ? setIsPrinting(true)
            : setIsPrintingPieceMachines(true);
    }

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
        <div className="pieces-container">
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
                <div className="search-group">
                    <div className="filter">
                        <CustomSelect
                            className="custom-select-filter custom-select"
                            label="Filtrar por"
                            dataFromChild={handleSelectClick}
                            showSelected={true}
                            content={[
                                { value: "name", label: "Referencia" },
                                { value: "type", label: "Tipo" },
                                { value: "brand", label: "Marca" },
                                { value: "description", label: "Descripción" },
                                { value: "supplier", label: "Proveedor" },
                                {
                                    value: "alternative_piece",
                                    label: "Alternativa",
                                },
                            ]}
                        />
                    </div>
                    <div className="search-input">
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
                    </div>
                </div>

                <div className="pieces-counter">
                    {pieces.length === 5000
                        ? `${pieces.length}+ piezas`
                        : `${pieces.length} piezas`}
                </div>

                <div className="piece-button-grp">
                    <button
                        type="button"
                        onClick={() => {
                            setGetCriticals(!getCriticals);
                        }}
                        className={
                            getCriticals
                                ? "filter-critical-btn-active"
                                : "filter-critical-btn"
                        }
                    ></button>

                    <CustomSelect
                        className="custom-select-print custom-select"
                        label="Imprimir"
                        dataFromChild={handleSelectPrint}
                        content={[
                            { value: "pieces", label: "Piezas" },
                            {
                                value: "pieces-machines",
                                label: "Piezas-Máquinas",
                            },
                        ]}
                    />

                    {/* <Button
                        className="print-list-btn"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPrinting(true)}
                    >
                        Imprimir lista
                    </Button> */}

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
                                isCritical={piece.is_critical}
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
                        totalElements={pieces.length}
                    />
                </Suspense>
            ) : search !== "" ? (
                <EmptyError
                    indicator={<MdSearchOff />}
                    description="No hay piezas que coincidan con la búsqueda"
                />
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
            {isPrinting && (
                <PrintPiecesList
                    contentRef={contentRef}
                    pieces={pieces}
                    reactToPrintFn={reactToPrintFn}
                    isPrinting={isPrinting}
                    setIsPrinting={setIsPrinting}
                />
            )}
            {isPrintingPieceMachines && (
                <PrintPiecesMachinesList
                    contentRef={contentRef}
                    pieces={pieces}
                    reactToPrintFn={reactToPrintFn}
                    isPrinting={isPrintingPieceMachines}
                    setIsPrinting={setIsPrintingPieceMachines}
                />
            )}
        </div>
    );
}
