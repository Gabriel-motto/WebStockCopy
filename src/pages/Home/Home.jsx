import { useRecentPieceMovements } from "@/hooks/useRecentPieceMovements";
import "./Home.css";
import { Table } from "@chakra-ui/react";
import { useState } from "react";
import { EmptyError } from "@/components/ui/EmptyStates";

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
                            <Table.ColumnHeader>Localizacion</Table.ColumnHeader>
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
            <div className="body">
                <div className="rows upper-body">
                    <div className="titles upper-body-title"></div>
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
