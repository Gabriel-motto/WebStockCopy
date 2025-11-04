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
import NewPiece from "./NewPiece.jsx";

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
