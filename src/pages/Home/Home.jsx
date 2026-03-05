import { IoImagesOutline } from "react-icons/io5";
import "./Home.css";
import { Image } from "@chakra-ui/react";
import { EmptyError } from "@/components/ui/EmptyStates";
import { useMachines } from "@/hooks/useMachines";
import { useWarehouse } from "@/hooks/useWarehouse";
import { useMachinesStockPiece, useWarehousesStockPiece } from "@/hooks/usePieces";
import { usePieceSerials } from "@/hooks/usePieceSerials";
import { Cell, Label, Legend, Pie, PieChart, Tooltip } from "recharts";
import { COLOR } from "@/utils/consts";
import { LinearProgressBar } from "@/components/progressBar/ProgressBar";

function Graphs() {
    const machinesStock = useMachinesStockPiece();
    const warehousesStock = useWarehousesStockPiece();
    const { machines, machinesLoading } = useMachines();
    const { warehouses, warehousesLoading } = useWarehouse();
    const pieces = usePieceSerials();

    const uniqueMachinesWithStock = [
        ...new Set(machinesStock?.data?.map((item) => item.machine_id)),
    ];
    const uniqueWarehousesWithStock = [
        ...new Set(warehousesStock?.data?.map((item) => item.warehouse_id)),
    ];
    const machinesStockAmount =
        machinesStock?.data
            ?.map((item) => item.amount)
            .reduce((a, b) => a + b, 0) || 0;
    const warehousesStockAmount =
        warehousesStock?.data
            ?.map((item) => item.amount)
            .reduce((a, b) => a + b, 0) || 0;

    const stockChartData = [
        { name: "Stock en máquinas", value: machinesStockAmount },
        { name: "Stock en almacenes", value: warehousesStockAmount },
    ];

    const warehouseChartData =
        warehouses?.map((warehouse) => {
            const warehouseStockAmount =
                warehousesStock?.data
                    ?.filter((item) => item.warehouse_id === warehouse.id)
                    .map((item) => item.amount)
                    .reduce((a, b) => a + b, 0) || 0;
            return { name: warehouse.name, value: warehouseStockAmount };
        }) || [];

    return (
        <div className="graphs-container">
            <div className="stock-chart">
                <div className="title chart-title">Distribución de stock</div>
                <PieChart
                    width={350}
                    height={200}
                >
                    <Pie
                        data={stockChartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius="100%"
                        innerRadius="80%"
                        cornerRadius="50%"
                        fill="#8884d8"
                        paddingAngle={1}
                        label
                    >
                        <Label
                            position="center"
                            fill="#666"
                        >
                            {`${machinesStockAmount + warehousesStockAmount} piezas`}
                        </Label>
                        {stockChartData.map((entry, index) => (
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
                    <Legend />
                </PieChart>
            </div>
            <LinearProgressBar
                current={uniqueMachinesWithStock.length}
                max={machines?.length}
                title="Progreso de máquinas con listado"
            />
            <div className="warehouse-chart">
                <div className="title chart-title">Distribución en almacenes</div>
                <PieChart
                    width={400}
                    height={225}
                >
                    <Pie
                        data={warehouseChartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius="80%"
                        innerRadius="60%"
                        cornerRadius="50%"
                        fill="#8884d8"
                        label
                    >
                        <Label
                            position="center"
                            fill="#666"
                        >
                            {`${warehouseChartData.reduce((sum, entry) => sum + entry.value, 0)} piezas`}
                        </Label>
                        {warehouseChartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    index % 2 === 0
                                        ? COLOR.SECONDARYCOLOR
                                        : COLOR.PRIMARYCOLOR
                                }
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </div>
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="main-container">
            <div className="titles main-title">Web Stock Demo</div>
            <div className="main-body">
                <div className="factory-image">
                    <EmptyError
                        indicator={<IoImagesOutline />}
                        title="IMAGEN DE FABRICA"
                        description="Aquí iría una imagen representativa de la fábrica."
                    />
                </div>
                <Graphs />
            </div>
        </div>
    );
}
