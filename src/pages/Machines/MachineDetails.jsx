import "./MachineDetails.css";
import { Image, Separator, Table, Text } from "@chakra-ui/react";
import { useSelectedMachine } from "@/hooks/useMachines";
import { useImageName, usePieces } from "@/hooks/usePieces";
import { useState, useMemo, useRef } from "react";
import PaginationControls from "@/components/ui/Pagination/Pagination.jsx";
import { TabComponent } from "@/components/ui/tab-component";
import { EmptyError } from "@/components/ui/EmptyStates";
import { navigateTo } from "@/utils/Link";
import Zoom from "react-medium-image-zoom";
import supabase from "@/utils/supabase";

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

function PieceInfoTable({ pieces }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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
    const pageDetails = details.slice(start, end);
    const pageAmounts = pieces.slice(start, end).map((p) => p.amount);

    // On row click, navigate to piece details
    const handleClick = (piece) => {
        navigateTo(`/pieces/${piece.name}`);
    };

    return (
        <div className="piece-related-content">
            <div className="title">Piezas en la máquina</div>
            <div className="piece-body">
                <Table.Root stickyHeader interactive>
                    <Table.ColumnGroup>
                        <Table.Column htmlWidth="10%" />
                        <Table.Column htmlWidth="2%" />
                        <Table.Column />
                    </Table.ColumnGroup>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Referencia</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center" >Cantidad</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center" >Descripción</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center" >Stock Mínimo</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center" >Crítico</Table.ColumnHeader>
                            <Table.ColumnHeader>Obsoleto</Table.ColumnHeader>
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
                                <Table.Cell textAlign="center" >
                                    <Text textStyle="xl">
                                        {pageAmounts[idx]}
                                    </Text>
                                </Table.Cell>
                                <Table.Cell>
                                    {piece.description || "Sin descripción"}
                                </Table.Cell>
                                <Table.Cell textAlign="center" >
                                    {piece.min_stock || "No definido"}
                                </Table.Cell>
                                <Table.Cell textAlign="center" >
                                    {piece.is_critical ? "Sí" : "No"}
                                </Table.Cell>
                                <Table.Cell>
                                    {piece.availability === "obsolete" ? "Obsoleto" : 
                                    piece.availability === "available" ? "Disponible" :
                                    piece.availability === "limited" ? "Limitado" : "No disponible"}
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

    return (
        <div className="machine-related-content">
            <div className="summary-header">
                <div className="summary-title">{data.name}</div>
                <div className="header-separator"></div>
                <div className="summary-description">{data.description}</div>
            </div>
            <Separator size="md" />
            <div className="machine-details-body">
                <Zoom>
                    <Image
                        className="summary-image"
                        src={
                            machineImage === null ||
                            machineImage?.length === 0
                                ? undefined
                                : supabase.storage
                                      .from("machines")
                                      .getPublicUrl(machineImage[0]?.name)
                                      .data.publicUrl
                        }
                        alt={`Máquina: ${data.name}`}
                    />
                </Zoom>
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
            <main className="container">
                {selectedTab === "summary" ? (
                    <Summary data={data} />
                ) : (
                    <PieceInfoTable pieces={pieces} />
                )}
            </main>
        </>
    );
}
