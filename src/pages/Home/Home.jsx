import { useRecentPieceMovements } from "@/hooks/useRecentPieceMovements";
import "./Home.css";
import { Button, Image, Table } from "@chakra-ui/react";
import { useState } from "react";
import { EmptyError } from "@/components/ui/EmptyStates";
import { COLOR } from "@/utils/consts";

function MovementsTable() {
    const [filters, setFilters] = useState({
        machine: "all",
        piece: "",
        warehouse: [],
    });
    const movements = useRecentPieceMovements(filters);

    return (
        <div className="movements-table">
            <div className="titles movements-title">Movimientos recientes</div>
            {movements.length === 0 ? (
                <EmptyError description="No hay movimientos recientes." />
            ) : (
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Pieza</Table.ColumnHeader>
                            <Table.ColumnHeader>
                                Localizacion
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>Cantidad</Table.ColumnHeader>
                            <Table.ColumnHeader>Fecha</Table.ColumnHeader>
                            <Table.ColumnHeader>Acción</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {movements.map((movement, index) => (
                            <Table.Row key={index}>
                                <Table.Cell>{movement.piece}</Table.Cell>
                                {movement.machine ? (
                                    <Table.Cell>{movement.machine}</Table.Cell>
                                ) : (
                                    <Table.Cell>
                                        {movement.warehouse}
                                    </Table.Cell>
                                )}
                                <Table.Cell>{movement.amount}</Table.Cell>
                                <Table.Cell>{movement.date}</Table.Cell>
                                <Table.Cell>{movement.action}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="main-container">
            <div className="titles main-title">Stock planta Vigo</div>
            <Image
                className="factory-image"
                src="/assets/FabricaGKNVigo.jpg"
                alt="Imagen de la fábrica de Vigo"
            ></Image>
            <div className="body">
                <div className="rows upper-body">
                    <div className="titles upper-body-title"></div>
                    <Button
                        className="videos-btn"
                        asChild
                    >
                        <a
                            href="https://gkn.sharepoint.com/:f:/r/sites/EURMaintenanceExcellenceNetwork/Shared%20Documents/Learning/Best%20Practice/2025-VIG-Videos?csf=1&web=1&e=lTtHT0"
                            target="_blank"
                            rel="noopener"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            Vídeos de estándares
                        </a>
                    </Button>
                </div>
                <div className="rows lower-body">
                    <div className="titles lower-body-title"></div>
                    <MovementsTable />
                </div>
            </div>
            <div className="footer"></div>
        </div>
    );
}
