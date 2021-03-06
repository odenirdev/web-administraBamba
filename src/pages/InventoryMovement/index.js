import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { FaFolder, FaPlus, FaMinus, FaDollyFlatbed } from "react-icons/fa";
import produce from "immer";

import AddButton from "../../components/AddButton";
import Table, { ResponsiveTable } from "../../components/Table";
import Modal from "../../components/Modal";
import AuthContainer from "../../components/Container";
import { Input } from "../../components/Form";

import { Container } from "./styles";

import InventoryMovementModal from "../../modals/InvetoryMovement";

import { Error } from "../../modules/notifications";
import { Mask } from "../../modules/formatter";
import DataTables from "../../modules/datatables";

import api from "../../services/api";
import { Col, Row } from "react-bootstrap";

function Index() {
    const [show, setShow] = useState(false);

    const [selected, setSelected] = useState("");

    const [unitOfMeasurement, setUnitOfMeasurement] = useState({});

    const [unitOfMeasurementData, setUnitOfMeasurementData] = useState([]);

    const [filters, setFilters] = useState({ begin: "", end: "" });

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

    const setReactComponentinTable = useCallback(() => {
        const handleEdit = (id) => {
            setSelected(id);
            setShow(true);
        };

        const setReactComponentinTable = () => {
            const editarEls = document.querySelectorAll(".editar");

            for (const editarEl of editarEls) {
                ReactDOM.render(
                    <FaFolder
                        className="open-icon"
                        onClick={() => {
                            handleEdit(editarEl.dataset.id);
                        }}
                    />,
                    document.getElementById(editarEl.id)
                );
            }

            const typeEls = document.querySelectorAll(".type");

            for (const typeEl of typeEls) {
                ReactDOM.render(
                    typeEl.dataset.value === "true" ? (
                        <FaPlus color="var(--green)" />
                    ) : (
                        <FaMinus color="var(--red)" />
                    ),
                    document.getElementById(typeEl.id)
                );
            }
        };

        setReactComponentinTable();
    }, []);

    const index = useCallback(() => {
        async function index() {
            try {
                let endPoint =
                    "/inventory-movements?_limit=-1&_sort=createdAt:DESC&deleted=false";

                if (filters.begin) {
                    endPoint += `&createdAt_gte=${filters.begin}`;
                }

                if (filters.end) {
                    endPoint += `&createdAt_lte=${filters.end}T23:59:59`;
                }

                const { data } = await api.get(endPoint);

                const serializedData = data.map((item) => {
                    const {
                        id,
                        type,
                        asset: { name: asset, unit_of_measurement },
                        quantity,
                        createdAt,
                    } = item;

                    return {
                        id,
                        type: `<div class="type" data-value="${type}" id="type-${id}"></div>`,
                        asset,
                        quantity: `${Mask(
                            parseFloat(quantity).toFixed(2),
                            "##0,00",
                            { reverse: true }
                        )} ${unitOfMeasurement[unit_of_measurement]}`,
                        createdAt: new Date(createdAt)
                            .toLocaleString()
                            .slice(0, 16),
                        open: `<div class="editar" data-id="${id}" id="editar-${id}"></div>`,
                    };
                });

                DataTables(
                    "#inventory-movement-table",
                    serializedData,
                    [
                        { title: "Ativo", data: "asset" },
                        { title: "Tipo", data: "type" },
                        { title: "Quantidade", data: "quantity" },
                        { title: "Data", data: "createdAt" },
                        { title: "Abrir", data: "open" },
                    ],
                    () => {
                        setReactComponentinTable();
                    }
                );
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, [setReactComponentinTable, unitOfMeasurement, filters]);

    useEffect(() => {
        index();
    }, [index]);

    function handleAddModal() {
        setSelected("");
        setShow(true);
    }

    function handleOnCloseModal() {
        setSelected("");
        setShow(false);
    }

    return (
        <>
            <Modal
                {...{ show }}
                onClose={handleOnCloseModal}
                title={`${!selected ? "Nova" : ""} Movimentação de Estoque`}
            >
                <InventoryMovementModal
                    {...{ selected }}
                    onClose={handleOnCloseModal}
                    reload={index}
                />
            </Modal>
            <AuthContainer>
                <Container>
                    <header>
                        <h1>Movimentações de Estoque</h1>
                        <Row>
                            <Col>
                                <Input
                                    type="date"
                                    name="begin"
                                    label="Início"
                                    value={filters.begin}
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            begin: e.target.value,
                                        });
                                    }}
                                />
                            </Col>
                            <Col>
                                <Input
                                    type="date"
                                    name="end"
                                    label="Fim"
                                    value={filters.end}
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            end: e.target.value,
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <div>
                            <AddButton
                                Icon={FaDollyFlatbed}
                                title="Cadastrar movimentação"
                                onClick={handleAddModal}
                            />
                        </div>
                    </header>
                    <ResponsiveTable>
                        <Table id="inventory-movement-table"></Table>
                    </ResponsiveTable>
                </Container>
            </AuthContainer>
        </>
    );
}

export default Index;
