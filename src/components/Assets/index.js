import React, { useState, useEffect, useCallback } from "react";
import { FaFolder } from "react-icons/fa";

import { Container } from "./styles";

import Table, { ResponsiveTable } from "../../components/Table";

import { Error } from "../../modules/notifications";
import { Mask } from "../../modules/formatter";

import Assets from "../../modals/Assets";

import api from "../../services/api";

import AddButton from "../AddButton";
import Modal from "../Modal";

function Index() {
    const [show, setShow] = useState(false);

    const [data, setData] = useState([]);

    const [selected, setSelected] = useState({});

    function handleAddModal() {
        setSelected({});
        setShow(true);
    }

    function handleOnCloseModal() {
        setSelected({});
        setShow(false);
    }

    function handleOpenModal(data) {
        setSelected(data);
        setShow(true);
    }

    const index = useCallback(() => {
        async function index() {
            try {
                const { data } = await api.get(
                    "/assets?_limit=-1&deleted=false"
                );

                setData(data);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, []);

    useEffect(() => {
        index();
    }, [index]);

    return (
        <>
            <Modal
                {...{ show }}
                onClose={handleOnCloseModal}
                title={`${
                    Object.keys(selected).length === 0 ? "Nova" : selected.name
                } átivo`}
            >
                <Assets {...{ selected, index, onClose: handleOnCloseModal }} />
            </Modal>
            <Container>
                <header>
                    <h1>Átivos</h1>
                    <AddButton onClick={handleAddModal} />
                </header>
                {data.length !== 0 && (
                    <ResponsiveTable>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Categoria</th>
                                    <th>Quant.</th>
                                    <th>Un. de Medida</th>
                                    <th>Custo</th>
                                    <th className="d-flex justify-content-center">
                                        Abrir
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.category.name}</td>
                                        <td>
                                            {Mask(
                                                parseFloat(
                                                    item.quantity
                                                ).toFixed(2),
                                                "##0,00",
                                                {
                                                    reverse: true,
                                                }
                                            )}
                                        </td>
                                        <td>
                                            {item.unit_of_measurement.abbr
                                                ? item.unit_of_measurement.abbr
                                                : item.unit_of_measurement.name}
                                        </td>
                                        <td>
                                            {Mask(
                                                parseFloat(item.cost).toFixed(
                                                    2
                                                ),
                                                "#.##0,00",
                                                {
                                                    reverse: true,
                                                }
                                            )}
                                        </td>
                                        <td className="d-flex justify-content-center">
                                            <FaFolder
                                                className="open-icon"
                                                onClick={() => {
                                                    handleOpenModal(item);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </ResponsiveTable>
                )}
            </Container>
        </>
    );
}

export default Index;
