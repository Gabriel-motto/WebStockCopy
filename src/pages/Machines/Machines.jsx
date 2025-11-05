import { useState, lazy, Suspense, useRef, useEffect } from "react";
import PaginationControls from "@/components/ui/Pagination/Pagination.jsx";
import { IoSearch } from "react-icons/io5";
import {
    Input,
    InputGroup,
    Table,
    CloseButton,
    Button,
} from "@chakra-ui/react";
import { SelectAssemblyLine } from "../../components/ui/Select/Select.jsx";
import MachineDetails from "./MachineDetails.jsx";
import { useMachines } from "../../hooks/useMachines";
import { useDebounce } from "@uidotdev/usehooks";
import { EmptyError } from "@/components/ui/EmptyStates";
import "./Machines.css";
import { LoadingScreenHelix } from "@/components/loadingScreen/LoadingScreen.jsx";
import { navigateTo } from "@/utils/Link.jsx";
import { useAssemblyLines } from "@/hooks/useALine.jsx";

//TODO maquinas criticas 2571, 2528, 3247, 2821, 2022, 2051, 3140, wa6135

const DialogComponent = lazy(() =>
    import("../../components/dialog/Dialog.jsx")
);

function MachinesTable({ machines, handleClick }) {
    const ALines = useAssemblyLines();
    console.log(ALines);

    return (
        <Table.Root interactive>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Nombre</Table.ColumnHeader>
                    <Table.ColumnHeader>Descripción</Table.ColumnHeader>
                    <Table.ColumnHeader>Línea</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {machines.map((machine, index) => (
                    <Table.Row
                        key={index}
                        onClick={() => handleClick(machine)}
                        _hover={{ cursor: "pointer" }}
                    >
                        <Table.Cell>{machine.name}</Table.Cell>
                        <Table.Cell>{machine.description}</Table.Cell>
                        <Table.Cell>
                            {ALines.find(
                                (ALine) => ALine.id === machine.assembly_line_id
                            )?.name || "N/A"}
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}

export default function MachinesPage({ params = {} }) {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [selectedMachineData, setSelectedMachineData] = useState();
    const [selectedALines, setSelectedAlines] = useState([]);
    const [search, setSearch] = useState("");
    const [getCriticals, setGetCriticals] = useState(false);
    const debouncedSearch = useDebounce(search, 300);
    const machines = useMachines({
        selectedALines: selectedALines,
        search: search,
        debouncedSearch: debouncedSearch,
        getCriticals: getCriticals,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const siblings = 2; // Número de páginas antes y después de la actual
    const totalPages = Math.ceil(machines.length / pageSize);

    // Si cambias páginaSize resetea a 1
    const handleSizeChange = (size) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    // Define slice
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageMachines = machines.slice(start, end);

    const handleAssemblyLineChange = (value) => {
        setSelectedAlines(value);
    };

    // Open dialog if params.name is present
    useEffect(() => {
        if (params.name) {
            const found = machines.find((m) => m.name === params.name);
            if (found) {
                setSelectedMachineData(found);
                setShowDetailsDialog(true);
            }
        } else {
            setShowDetailsDialog(false);
        }
    }, [params.name, machines]);

    // On row click, navigate to /machines/:name
    const handleOnClickMachine = (data) => {
        setSelectedMachineData(data);
        setShowDetailsDialog(true);
        navigateTo(`/machines/${encodeURIComponent(data.name)}`);
    };

    // When dialog closes, go back to /machines
    const handleCloseDialog = () => {
        setShowDetailsDialog(false);
        if (params.name) {
            navigateTo("/machines");
        }
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
        <main>
            <div className="search-bar">
                <div className="search-line-critical">
                    <SelectAssemblyLine
                        dataFromChild={handleAssemblyLineChange}
                    />
                    {!getCriticals ? (
                        <Button
                            colorPalette="red"
                            variant="outline"
                            onClick={() => {
                                setGetCriticals(true);
                            }}
                        >
                            Filtrar por críticas
                        </Button>
                    ) : (
                        <Button
                            colorPalette="blue"
                            variant="outline"
                            onClick={() => {
                                setGetCriticals(false);
                            }}
                        >
                            Mostrar todas
                        </Button>
                    )}
                </div>
                <div className="search-input-machines">
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
            {totalPages !== 0 ? (
                <>
                    <div className="table-machines">
                        {pageMachines ? (
                            <MachinesTable
                                machines={pageMachines}
                                handleClick={handleOnClickMachine}
                            />
                        ) : null}
                    </div>
                    <PaginationControls
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={handleSizeChange}
                        siblingCount={siblings}
                    />
                </>
            ) : search !== "" ? (
                <EmptyError description="Ninguna máquina coincide con la busqueda" />
            ) : null}
            <Suspense fallback={<LoadingScreenHelix />}>
                <DialogComponent
                    scrollBehavior="inside"
                    size="cover"
                    title="Detalles de la máquina"
                    content={
                        selectedMachineData && (
                            <MachineDetails data={selectedMachineData} />
                        )
                    }
                    open={showDetailsDialog}
                    close={handleCloseDialog}
                    lazyMount
                    placement="center"
                    motionPreset="slide-in-bottom"
                />
            </Suspense>
        </main>
    );
}
