import "./PiecesDetails.css";
import {
    Image,
    Text,
    Badge,
    Separator,
    Heading,
    Button,
} from "@chakra-ui/react";
import { useSelectedPiece } from "@/hooks/usePieces";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import { COLOR } from "@/utils/consts";
import { CustomLink } from "@/utils/Link";
import { PopoverComponent } from "@/components/ui/Popover-component";
import { IoWarningOutline } from "react-icons/io5";
import supabase from "@/utils/supabase";
import { CustomSelect } from "@/components/ui/Select/Select";

export default function PiecesDetails({ data }) {
    const pieceData = useSelectedPiece(data.name);

    const totalInMachines =
        pieceData?.machineStock.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalInWarehouse =
        pieceData?.warehouseStock.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalStock = totalInMachines + totalInWarehouse;
    const machinesWithPiece = pieceData?.machineStock.length || 0;
    const warehousesWithPiece = pieceData?.warehouseStock.length || 0;

    const chartData = [
        { name: "En máquinas", value: totalInMachines },
        { name: "En almacén", value: totalInWarehouse },
    ];

    function handleSelectClick(value) {
        console.log("Opción seleccionada:", value);
        // Aquí puedes agregar la lógica para manejar la acción seleccionada
    }

    return (
        <>
            <div className="warning-badges">
                {data?.isCritical === true && (
                    <div className="critical-badge">
                        <IoWarningOutline />
                        &nbsp;Crítico
                    </div>
                )}
                {data?.avaliability === "spare_part" && (
                    <div className="spare-badge">Descatalogado</div>
                )}
            </div>
            <div className="actions-button">
                <CustomSelect
                    dataFromChild={handleSelectClick}
                    content={[
                        { value: "add", label: "Añadir stock" },
                        { value: "edit", label: "Editar datos" },
                        { value: "delete", label: "Eliminar pieza" },
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
                                {data?.buyPrice
                                    ? `${data.buyPrice} €`
                                    : "No hay precio de compra"}
                            </Text>
                        </div>
                        <div className="data-box repair-price">
                            <Text className="label repair-price-label">
                                Precio de reparación
                            </Text>
                            <Text className="value repair-price-value">
                                {data?.repairPrice
                                    ? `${data.repairPrice} €`
                                    : "No hay precio de reparación"}
                            </Text>
                        </div>
                        <div className="data-box last-movements">
                            <Text className="label last-movements-label">
                                Últimos movimientos
                            </Text>
                            <Text className="value last-movements-value">
                                {data?.last_movements
                                    ? data.last_movements.join(", ")
                                    : "No hay últimos movimientos"}
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
                        <div className="data-box alt-piece">
                            <Text className="label alt-piece-label">
                                Pieza alternativa
                            </Text>
                            <Text className="value alt-piece-value">
                                {data?.altPiece
                                    ? data.altPiece
                                    : "No hay pieza alternativa"}
                            </Text>
                        </div>
                        <div className="data-box additional-info-box">
                            <Text className="label additional-info-label">
                                Información adicional
                            </Text>
                            <Text className="value additional-info-value">
                                {data?.additional_info
                                    ? data.addInfo
                                    : "No hay información adicional"}
                            </Text>
                        </div>
                    </div>
                    <div className="charts">
                        <Heading>
                            Stock total en máquinas/almacén: {totalStock}
                        </Heading>
                        <PopoverComponent
                            title="Localización de esta pieza"
                            content={
                                <div className="popover-content">
                                    <ul>
                                        {pieceData?.machineStock.map((m) => (
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
                                        {pieceData?.warehouseStock.map((w) => (
                                            <li key={w.location}>
                                                <Text textStyle="lg">
                                                    {w.location}: {w.amount}
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
                                                        ? COLOR.CORPBLUE
                                                        : COLOR.CORPYELLOW
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
                            positioning={{ placement: "right" }}
                        />
                    </div>
                    <div className="piece-in-machines"></div>
                </div>
                <div className="right-side">
                    <Image
                        className="image-dialog piece-image"
                        src={
                            supabase.storage
                                .from("pieces")
                                .getPublicUrl(`${data.name}.webp`).data
                                .publicUrl
                        }
                        alt={`Producto con referencia: ${data.name}`}
                    />
                    <Separator
                        className="image-separator"
                        size="md"
                    />
                    <Image
                        className="image-dialog data-card-image"
                        src={
                            supabase.storage
                                .from("pieces")
                                .getPublicUrl(`${data.name}-data-card.webp`)
                                .data.publicUrl
                        }
                        alt={`Producto con referencia: ${data.name}`}
                    />
                </div>
            </div>
        </>
    );
}
