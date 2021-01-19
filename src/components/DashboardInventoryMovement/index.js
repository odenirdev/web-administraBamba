import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaDollyFlatbed } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import produce from "immer";

import CircleButton from "../CircleButton";

import { Container } from "./styles";

import { Error } from "../../modules/notifications";
import { Mask } from "../../modules/formatter";

import api from "../../services/api";

import Table from "../Table";

function Index() {
    const history = useHistory();

    const [data, setData] = useState([]);

    const [unitOfMeasurement, setUnitOfMeasurement] = useState({});
    const [unitOfMeasurementData, setUnitOfMeasurementData] = useState([]);

    useEffect(() => {
        async function indexUnitOfMensurement() {
            try {
                const response = await api.get(
                    "/unit-of-measurements?_limit=-1&deleted=false"
                );

                setUnitOfMeasurementData(response.data);
            } catch (error) {
                Error(error);
            }
        }

        indexUnitOfMensurement();
    }, []);

    useEffect(() => {
        function indexUnitOfMeasurement() {
            setUnitOfMeasurement(
                produce(unitOfMeasurement, (draftState) => {
                    unitOfMeasurementData.forEach((unit) => {
                        draftState[unit.id] = unit.abbr ? unit.abbr : unit.name;
                    });
                })
            );
        }

        indexUnitOfMeasurement();
    }, [unitOfMeasurement, unitOfMeasurementData]);

    useEffect(() => {
        async function index() {
            try {
                const { data } = await api.get(
                    "/inventory-movements?_limit=5&_sort=createdAt:DESC&deleted=false"
                );

                setData(data);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, []);

    if (!data.length) return <></>;

    return (
        <Container>
            <header>
                <h2>Últimas Movimentações de Estoque</h2>
                <CircleButton
                    Icon={FaDollyFlatbed}
                    title="Movimentações de Estoque"
                    onClick={() => {
                        history.push("/inventory-movements");
                    }}
                />
            </header>
            <Table>
                <thead>
                    <tr>
                        <th>Ativo</th>
                        <th>Tipo</th>
                        <th>Quantidade</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((move) => (
                        <tr key={move.id}>
                            <td>{move.asset.name}</td>
                            <td>
                                {move.type ? (
                                    <FaPlus color="var(--green)" />
                                ) : (
                                    <FaMinus color="var(--red)" />
                                )}
                            </td>
                            <td>
                                {Mask(
                                    parseFloat(move.quantity).toFixed(2),
                                    "##0,00",
                                    { reverse: true }
                                )}{" "}
                                {
                                    unitOfMeasurement[
                                        move.asset.unit_of_measurement
                                    ]
                                }
                            </td>
                            <td>
                                {new Date(move.createdAt)
                                    .toLocaleString()
                                    .slice(0, 16)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default Index;
