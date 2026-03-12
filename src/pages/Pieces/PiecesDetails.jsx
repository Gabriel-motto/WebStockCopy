import "./PiecesDetails.css";
import { Image, Text, Separator, Heading, Accordion } from "@chakra-ui/react";
import {
    useImageName,
    useMachinesStockPiece,
    useTotalStockPiece,
    useWarehousesStockPiece,
} from "@/hooks/usePieces";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import { COLOR } from "@/utils/consts";
import { CustomLink, navigateTo } from "@/utils/Link";
import { PopoverComponent } from "@/components/ui/Popover-component";
import { IoWarningOutline } from "react-icons/io5";
import supabase from "@/utils/supabase";
import { CustomSelect } from "@/components/ui/Select/Select";
import { useState } from "react";
import DialogComponent from "@/components/dialog/Dialog";
import {
    AddStockMenu,
    DeleteStockMenu,
    EditStockMenu,
    MoveStockMenu,
    PrintMenu,
    ConfirmRepairMenu,
} from "./Menus";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { TabComponent } from "@/components/ui/tab-component";
import { usePieceSerials } from "@/hooks/usePieceSerials";
import { EmptyError } from "@/components/ui/EmptyStates";
import { CiImageOff } from "react-icons/ci";
import { useRecentPieceMovements } from "@/hooks/useRecentPieceMovements";
import { formatDate } from "@/utils/dateFormat";

const tabData = [
    {
        id: "details",
        title: "Detalles",
    },
    {
        id: "traceability",
        title: "Trazabilidad",
    },
];

export default function PiecesDetails({ data }) {
    const [selectedTab, setSelectedTab] = useState("details");
    const machines = useMachinesStockPiece({ pieceId: data.id });
    const warehouses = useWarehousesStockPiece({ pieceId: data.id });
    const recentMovements = useRecentPieceMovements({
        pieceId: data.id,
        orderBy: "occurred_at",
        asc: false,
    });

    function handleTabChange(e) {
        setSelectedTab(e.value);
    }

    return (
        <>
            <TabComponent
                tabContent={tabData}
                defaultValue={"details"}
                dataFromChild={handleTabChange}
            />
            <main className="container">
                {selectedTab === "details" ? (
                    <Details
                        data={data}
                        machines={machines}
                        warehouses={warehouses}
                    />
                ) : (
                    <Traceability
                        data={data}
                        machines={machines}
                        warehouses={warehouses}
                        recentMovements={recentMovements}
                    />
                )}
            </main>
        </>
    );
}

function Traceability({ data, machines, warehouses, recentMovements }) {
    const [showDialog, setShowDialog] = useState(false);
    const { serials: pieceSerials } = usePieceSerials({ pieceId: data.id });
    const [serialSelected, setSerialSelected] = useState(null);
    const recentMachineMovements = recentMovements.data?.filter(
        (movement) => movement.machine_to !== null,
    );
    const recentWarehouseMovements = recentMovements.data?.filter(
        (movement) => movement.warehouse_to !== null,
    );

    const lastMachineDate = new Date(recentMachineMovements?.[0]?.occurred_at);
    const lastWarehouseDate = new Date(
        recentWarehouseMovements?.[0]?.occurred_at,
    );

    function closeDialog() {
        setShowDialog(false);
    }

    console.log(pieceSerials)

    return (
        <div className="traceability-body">
            <DialogComponent
                size="md"
                scrollBehavior="outside"
                title="Confirmar"
                content={
                    <ConfirmRepairMenu
                        piece={data}
                        serial={serialSelected}
                        handleCancel={closeDialog}
                    />
                }
                open={showDialog}
                close={closeDialog}
                lazyMount
                placement="center"
                motionPreset="slide-in-bottom"
            />
            <Accordion.Root collapsible>
                {pieceSerials?.map((serial) => (
                    <Accordion.Item
                        key={serial.serial_code}
                        value={serial.serial_code}
                    >
                        <Accordion.ItemTrigger>
                            Serial: {serial.serial_code} -{" "}
                            {serial.current_machine
                                ? machines?.data?.find(
                                      (m) =>
                                          m.machine_id ===
                                          serial.current_machine,
                                  )?.machine
                                : warehouses?.data?.find(
                                      (w) =>
                                          w.warehouse_id ===
                                          serial.current_warehouse,
                                  )?.warehouse}
                            <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                            <Accordion.ItemBody>
                                <div className="serial-details">
                                    <p>
                                        <strong>Movimientos totales:</strong>{" "}
                                        {
                                            recentMovements?.data?.filter(
                                                (movement) =>
                                                    movement.piece_serial ===
                                                    serial.serial_code,
                                            ).length
                                        }
                                    </p>
                                    <p>
                                        <strong>Último movimiento:</strong>{" "}
                                        {recentMachineMovements?.length !== 0 &&
                                        lastMachineDate !== "Invalid Date"
                                            ? formatDate(lastMachineDate)
                                            : recentWarehouseMovements?.length !==
                                                    0 && lastWarehouseDate
                                              ? formatDate(lastWarehouseDate)
                                              : "N/A"}
                                    </p>
                                    <p>
                                        <strong>Información adicional:</strong>{" "}
                                        {recentMachineMovements?.[0]?.note ||
                                            recentWarehouseMovements?.[0]
                                                ?.note ||
                                            " N/A"}
                                    </p>
                                    <p>
                                        <strong>Estado:</strong>{" "}
                                        {serial.status === "active"
                                            ? "Instalada"
                                            : serial.status === "inactive"
                                              ? "En stock"
                                              : serial.status === "repairing"
                                                ? "En reparación"
                                                : "Desconocido"}
                                    </p>
                                    <button
                                        className={`send-repair-btn button ${serial.status === "repairing" && "repairing-btn"}`}
                                        onClick={() => {
                                            setSerialSelected(
                                                serial.serial_code,
                                            );
                                            setShowDialog(true);
                                        }}
                                    ></button>
                                </div>
                            </Accordion.ItemBody>
                        </Accordion.ItemContent>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </div>
    );
}

function Details({ data, machines, warehouses }) {
    const pieceStock = useTotalStockPiece({ pieceId: data.id });
    const movements = useRecentPieceMovements({ pieceId: data.id });
    const [showDialog, setShowDialog] = useState(false);
    const [selectedValue, setSelectedValue] = useState(null);
    const pieceImageName = useImageName({
        bucket: "pieces",
        baseName: data?.name,
    });
    const dataCardImageName = useImageName({
        bucket: "pieces",
        baseName: data?.name + "-data-card",
    });
    const additionalImageName = useImageName({
        bucket: "pieces",
        baseName: data?.name + "-additional",
    });

    const chartData = [
        {
            name: "En máquinas",
            value: machines?.data
                .map((item) => item.amount)
                .reduce((a, b) => a + b, 0),
        },
        {
            name: "En almacén",
            value: warehouses?.data
                .map((item) => item.amount)
                .reduce((a, b) => a + b, 0),
        },
    ];

    function handleSelectClick(value) {
        if (value !== null) {
            setSelectedValue(value);
            setShowDialog(true);
        }
    }

    function closeDialog() {
        setShowDialog(false);
    }

    function refineMovementsData() {
        return `Pieza nueva (${
            movements.data.filter((movement) => movement.action === "new")
                .length
        }), Pieza movida (${
            movements.data.filter((movement) => movement.action === "move")
                .length
        }), Pieza reparada (${
            movements.data.filter(
                (movement) => movement.action === "repair_out",
            ).length
        })`;
    }

    return (
        <>
            <DialogComponent
                size="md"
                scrollBehavior="outside"
                title={
                    selectedValue === "move"
                        ? "Mover pieza"
                        : selectedValue === "edit"
                          ? "Editar datos"
                          : selectedValue === "add"
                            ? "Añadir stock"
                            : selectedValue === "print"
                              ? "Imprimir etiqueta"
                              : ""
                }
                content={
                    selectedValue === "move" ? (
                        <MoveStockMenu
                            piece={data}
                            inStock={[...machines?.data, ...warehouses?.data]}
                            handleCancel={closeDialog}
                        />
                    ) : selectedValue === "edit" ? (
                        <EditStockMenu
                            pieceInfo={data}
                            handleCancel={closeDialog}
                            pieceImageOld={pieceImageName[0]}
                            dataCardOld={dataCardImageName[0]}
                            additionalImageOld={additionalImageName[0]}
                        />
                    ) : selectedValue === "add" ? (
                        <AddStockMenu
                            piece={data}
                            handleCancel={closeDialog}
                        />
                    ) : selectedValue === "print" ? (
                        <PrintMenu
                            piece={data}
                            inStock={[...machines?.data, ...warehouses?.data]}
                            handleCancel={closeDialog}
                        />
                    ) : null
                }
                open={showDialog}
                close={closeDialog}
                lazyMount
                placement="center"
                motionPreset="slide-in-bottom"
            />

            <div className="warning-badges">
                {data?.is_critical === true && (
                    <div className="critical-badge">
                        <IoWarningOutline />
                        &nbsp;Crítico
                    </div>
                )}
                {data?.availability === "obsolete" && (
                    <div className="spare-badge">Descatalogado</div>
                )}
            </div>
            <div className="actions-button">
                <CustomSelect
                    dataFromChild={handleSelectClick}
                    content={[
                        { value: "move", label: "Mover pieza" },
                        { value: "edit", label: "Editar datos" },
                        { value: "add", label: "Añadir stock" },
                        { value: "print", label: "Imprimir etiqueta" },
                    ]}
                />
            </div>
            <div className="summary-body">
                <div className="left-side">
                    <div className="data-boxes">
                        <div className="data-box name-box">
                            <Text className="label name-label">Referencia</Text>
                            <Text className="value name-value">
                                {data?.name}
                            </Text>
                        </div>
                        <div className="data-box brand-box">
                            <Text className="label brand-label">Marca</Text>
                            <Text className="value brand-value">
                                {data?.brand}
                            </Text>
                        </div>
                        <div className="data-box type-box">
                            <Text className="label type-label">Tipo</Text>
                            <Text className="value type-value">
                                {data?.type}
                            </Text>
                        </div>
                        <div className="data-box description-box">
                            <Text className="label description-label">
                                Descripción
                            </Text>
                            <Text className="value description-value">
                                {data?.description
                                    ? data.description
                                    : "No hay descripción"}
                            </Text>
                        </div>
                        <div className="data-box buy-price">
                            <Text className="label buy-price-label">
                                Precio de compra
                            </Text>
                            <Text className="value buy-price-value">
                                {data?.buy_price
                                    ? `${data.buy_price} €`
                                    : "No hay precio de compra"}
                            </Text>
                        </div>
                        <div className="data-box repair-price">
                            <Text className="label repair-price-label">
                                Precio de reparación
                            </Text>
                            <Text className="value repair-price-value">
                                {data?.repair_price
                                    ? `${data.repair_price} €`
                                    : "No hay precio de reparación"}
                            </Text>
                        </div>
                        <div className="data-box last-movements">
                            <Text className="label last-movements-label">
                                Últimos movimientos
                            </Text>
                            <Text className="value last-movements-value">
                                {movements?.data
                                    ? refineMovementsData()
                                    : "No hay últimos movimientos"}
                            </Text>
                        </div>
                        <div className="data-box ref-piece-box">
                            <Text className="label ref-piece-label">
                                Pieza referenciada
                            </Text>
                            <Text className="value ref-piece-value">
                                {data?.ref_piece
                                    ? data.ref_piece
                                    : "No es una pieza referenciada"}
                            </Text>
                        </div>
                        <div className="data-box supplier-box">
                            <Text className="label supplier-label">
                                Proveedor
                            </Text>
                            <Text className="value supplier-value">
                                {data?.supplier
                                    ? data.supplier
                                    : "No hay proveedor asignado"}
                            </Text>
                        </div>
                        <div className="data-box alt-piece-box">
                            <Text className="label alt-piece-label">
                                Pieza alternativa
                            </Text>
                            <Text className="value alt-piece-value">
                                {data?.alternative_piece
                                    ? data.alternative_piece
                                    : "No hay pieza alternativa"}
                            </Text>
                        </div>
                        <div className="data-box additional-info-box">
                            <Text className="label additional-info-label">
                                Información adicional
                            </Text>
                            <Text className="value additional-info-value">
                                {data?.additional_info
                                    ? data.additional_info
                                    : "No hay información adicional"}
                            </Text>
                        </div>
                    </div>
                    <div className="charts">
                        <Heading>
                            Stock total en máquinas/almacén:{" "}
                            {pieceStock?.data[0]
                                ? pieceStock?.data[0].amount
                                : 0}
                        </Heading>
                        <PopoverComponent
                            title="Localización de esta pieza"
                            content={
                                <div className="popover-content">
                                    <ul>
                                        {machines?.data.map((m) => (
                                            <li key={m.machine}>
                                                <Text textStyle="lg">
                                                    <CustomLink
                                                        to={`/machines/${m.machine}`}
                                                    >
                                                        {m.machine}
                                                    </CustomLink>
                                                    : {m.amount}
                                                    {m.amount > 1
                                                        ? " piezas"
                                                        : " pieza"}
                                                </Text>
                                            </li>
                                        ))}
                                    </ul>
                                    <ul>
                                        {warehouses?.data.map((w) => (
                                            <li key={w.warehouse_id}>
                                                <Text textStyle="lg">
                                                    {w.warehouse}: {w.amount}
                                                    {w.amount > 1
                                                        ? " piezas"
                                                        : " pieza"}
                                                </Text>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                            trigger={
                                <PieChart
                                    width={350}
                                    height={200}
                                >
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={80}
                                        innerRadius={50}
                                        label
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    index === 0
                                                        ? COLOR.SECONDARYCOLOR
                                                        : COLOR.PRIMARYCOLOR
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend
                                        verticalAlign="top"
                                        height={36}
                                    />
                                </PieChart>
                            }
                            size="lg"
                        />
                    </div>
                    <div className="piece-in-machines"></div>
                </div>
                <div className="right-side">
                    {pieceImageName?.length > 0 ? (
                        <Zoom>
                            <Image
                                className="image-dialog piece-image"
                                src={
                                    supabase.storage
                                        .from("pieces")
                                        .getPublicUrl(pieceImageName?.[0]?.name)
                                        .data?.publicUrl
                                }
                                alt={`Producto con referencia: ${data.name}`}
                            />
                        </Zoom>
                    ) : (
                        <EmptyError
                            indicator={<CiImageOff />}
                            title="SIN IMAGEN"
                            description={`No hay imagenes de la pieza ${data.name}`}
                        />
                    )}
                    {dataCardImageName?.length > 0 ? (
                        <>
                            <Separator
                                className="image-separator"
                                size="md"
                            />
                            <Zoom>
                                <Image
                                    className="image-dialog data-card-image"
                                    src={
                                        supabase.storage
                                            .from("pieces")
                                            .getPublicUrl(
                                                dataCardImageName?.[0]?.name,
                                            ).data.publicUrl
                                    }
                                    alt={`Producto con referencia: ${data.name}`}
                                />
                            </Zoom>
                        </>
                    ) : null}
                    {additionalImageName?.length > 0 ? (
                        <>
                            <Separator
                                className="image-separator"
                                size="md"
                            />
                            <Zoom>
                                <Image
                                    className="image-dialog additional-image"
                                    src={
                                        supabase.storage
                                            .from("pieces")
                                            .getPublicUrl(
                                                additionalImageName?.[0]?.name,
                                            ).data.publicUrl
                                    }
                                    alt={`Producto con referencia: ${data.name}`}
                                />
                            </Zoom>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    );
}
