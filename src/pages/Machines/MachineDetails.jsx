import "./MachineDetails.css";
import { Button, Image, Separator, Table, Text } from "@chakra-ui/react";
import { useSelectedMachine } from "@/hooks/useMachines";
import { useImageName, usePieces } from "@/hooks/usePieces";
import { useState, useMemo, useRef } from "react";
import PaginationControls from "@/components/ui/Pagination/Pagination.jsx";
import { TabComponent } from "@/components/ui/tab-component";
import { EmptyError } from "@/components/ui/EmptyStates";
import { navigateTo } from "@/utils/Link";
import Zoom from "react-medium-image-zoom";
import supabase from "@/utils/supabase";
import { useReactToPrint } from "react-to-print";
import { CiImageOff } from "react-icons/ci";
import { insertImage } from "@/services/pieces";

const tabData = [
    {
        id: "summary",
        title: "Máquina",
    },
    {
        id: "pieces",
        title: "Piezas",
    },
];

function PieceInfoTable({ pieces, machine }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const contentRef = useRef();
    const reactToPrintFn = useReactToPrint({ contentRef });
    const siblings = 2; // Número de páginas antes y después de la actual

    // Recalcula cuando cambien props
    const refs = useMemo(() => pieces.map((p) => p.piece), [pieces]);
    if (refs.length === 0) {
        return <EmptyError />;
    }
    const details = usePieces({ multiple: refs });

    const totalPages = Math.ceil(pieces.length / pageSize);

    // Si cambias páginaSize resetea a 1
    const handleSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    // Define slice
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageDetails = details.sort((a, b) => a.id - b.id).slice(start, end);
    const pageAmounts = pieces
        .sort((a, b) => a.piece_id - b.piece_id)
        .slice(start, end)
        .map((p) => p.amount);

    // On row click, navigate to piece details
    const handleClick = (piece) => {
        navigateTo(`/pieces/${piece.name}`);
    };

    return (
        <div className="piece-related-content">
            <div className="piece-info-table">
                <div className="title machine-pieces-title">
                    Piezas en la máquina
                </div>
                <div className="machine-pieces-print">
                    <Button className="print-machine-button" onClick={reactToPrintFn}>Imprimir tabla</Button>
                </div>
            </div>

            <div className="piece-body">
                <Table.Root stickyHeader interactive ref={contentRef}>
                    <Table.Caption
                        captionSide="top"
                        className="print-machine-pieces-title"
                    >
                        Piezas en la máquina {machine}
                    </Table.Caption>
                    <Table.ColumnGroup>
                        <Table.Column />
                        <Table.Column />
                        <Table.Column />
                    </Table.ColumnGroup>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Referencia</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">
                                Cantidad
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">
                                Descripción
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">
                                Stock Mínimo
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">
                                Crítico
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">
                                Disponibilidad
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {pageDetails.map((piece, idx) => (
                            <Table.Row
                                key={idx}
                                onClick={() => handleClick(piece)}
                                _hover={{ cursor: "pointer" }}
                            >
                                <Table.Cell>{piece.name}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Text textStyle="xl">
                                        {pageAmounts[idx]}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell>
                                    {piece.description || "Sin descripción"}
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    {piece.min_stock || "Sin definir"}
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    {piece.is_critical ? "Sí" : "No"}
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    {piece.availability === null
                                        ? "Sin definir"
                                        : piece.availability === "obsolete"
                                        ? "Obsoleto"
                                        : piece.availability === "available"
                                        ? "Disponible"
                                        : piece.availability === "limited"
                                        ? "Limitado"
                                        : "No disponible"}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>

                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={handleSizeChange}
                    siblingCount={siblings}
                    totalElements={pieces.length}
                />
            </div>
            <div className="additional-content"></div>
        </div>
    );
}

function Summary({ data }) {
    const machineImage = useImageName({
        bucket: "machines",
        baseName: data?.name,
    });

    function handlePieceImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const extFromFile = file?.type?.split("/")?.pop() || "";
        const path = `${data.name}.${extFromFile}`;

        console.log({file, path})

        insertImage("machines", { file: file, path: path });
    }

    return (
        <div className="machine-related-content">
            <div className="summary-header">
                <div className="summary-title">{data.name}</div>
                <div className="header-separator"></div>
                <div className="summary-description">{data.description}</div>
                <Button className="add-machine-image" variant="ghost" asChild>
                    <label htmlFor="pieceImage">Añadir foto</label>
                </Button>
                <input
                    className="machine-image-input"
                    type="file"
                    name="pieceImage"
                    id="pieceImage"
                    onChange={handlePieceImageUpload}
                    accept="image/*"
                    capture="environment"
                />
            </div>
            <Separator size="md" />
            <div className="machine-details-body">
                {machineImage?.length > 0 ? (
                    <Zoom>
                        <Image
                            className="summary-image"
                            src={
                                supabase.storage
                                    .from("machines")
                                    .getPublicUrl(machineImage[0]?.name).data
                                    .publicUrl
                            }
                            alt={`Máquina: ${data.name}`}
                        />
                    </Zoom>
                ) : (
                    <EmptyError
                        indicator={<CiImageOff />}
                        title="SIN IMAGEN"
                        description={`No hay imagenes de la máquina ${data.name}`}
                    />
                )}
            </div>
        </div>
    );
}

export default function MachineDetails({ data }) {
    const pieces = useSelectedMachine({ machineId: data.id });
    const [selectedTab, setSelectedTab] = useState("summary");

    const handleTabChange = (e) => {
        setSelectedTab(e.value);
    };

    return (
        <>
            <TabComponent
                tabContent={tabData}
                defaultValue={"summary"}
                dataFromChild={handleTabChange}
            />
            <main className="machine-details-container">
                {selectedTab === "summary" ? (
                    <Summary data={data} />
                ) : (
                    <PieceInfoTable pieces={pieces} machine={data.name} />
                )}
            </main>
        </>
    );
}
