import "./PiecesDetails.css";
import { Image, Text, Badge, Separator, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useSelectedPiece } from "@/hooks/usePieces";
import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import { COLOR } from "@/utils/consts";
import { CustomLink } from "@/utils/Link";
import supabase from "@/utils/supabase";

export default function PiecesDetails({ data }) {
    const pieceData = useSelectedPiece(data.name);

    const totalInMachines =
        pieceData?.machineStock.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalInWarehouse = pieceData?.warehouseStock || 0;
    const totalStock = totalInMachines + totalInWarehouse;
    const machinesWithPiece = pieceData?.machineStock.length || 0;

    const chartData = [
        { name: "En máquinas", value: totalInMachines },
        { name: "En almacén", value: totalInWarehouse },
    ];

    return (
        <div className="summary-body">
            <div className="container-box">
                <Image
                    className="image-dialog"
                    src={"/assets/GNK_logo_azul.png"}
                    alt={`Producto con referencia: ${data.name}`}
                />
                <div className="content-box">
                    <div className="title-dialog">
                        <Text
                            textStyle="3xl"
                            fontWeight="medium"
                            color="fg"
                        >
                            {data.name}
                        </Text>
                        <Text
                            textStyle="3xl"
                            fontWeight="medium"
                            color="fg.muted"
                        >
                            {data.brand}
                        </Text>
                    </div>
                    <Text
                        className="description-box"
                        lineClamp="3"
                        fontSize="18px"
                        letterSpacing="wide"
                    >
                        {data.description}
                    </Text>
                    {data.workshop !== null && (
                        <Badge
                            colorPalette="teal"
                            variant="solid"
                            className="workshop-badge"
                            size="lg"
                        >
                            {data.workshop === "mechanics"
                                ? "Mecánica"
                                : "Electrónica"}
                        </Badge>
                    )}
                </div>
                <div className="charts">
                    <Heading>Stock total en máquinas/almacén: {totalStock}</Heading>
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
                </div>
            </div>
            <Separator
                className="separator-dialog"
                size="md"
            />
            <div className="stock-body">
                <div className="general-stock-info">
                    <Text textStyle="lg">Total de piezas:</Text>
                    <Text
                        textStyle="7xl"
                        fontWeight="bold"
                    >
                        {totalStock}
                    </Text>
                </div>
                <div className="machines-list">
                    <Heading size="xl">
                        Máquinas que contienen esta pieza
                    </Heading>
                    {machinesWithPiece === 0 ? (
                        <Text color="gray.500">
                            Ninguna máquina contiene esta pieza.
                        </Text>
                    ) : (
                        <ul>
                            {pieceData.machineStock.map((m) => (
                                <li key={m.machine}>
                                    <Text textStyle="lg">
                                        <CustomLink
                                            to={`/machines/${m.machine}`}
                                        >
                                            {m.machine}
                                        </CustomLink>
                                        : {m.amount}
                                        {m.amount > 1 ? " piezas" : " pieza"}
                                    </Text>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
