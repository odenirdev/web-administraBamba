import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { useHistory } from "react-router-dom";
import { FaFolder, FaBox, FaDollyFlatbed } from "react-icons/fa";
import { Row } from "react-bootstrap";

import { Container } from "./styles";

import Table, { ResponsiveTable } from "../../components/Table";

import { Error } from "../../modules/notifications";
import DataTables from "../../modules/datatables";

import Assets from "../../modals/Assets";

import api from "../../services/api";

import AddButton from "../AddButton";
import Modal from "../Modal";

function Index() {
    const history = useHistory();

    const [show, setShow] = useState(false);

    const [selected, setSelected] = useState("");

    function handleAddModal() {
        setSelected("");
        setShow(true);
    }

    function handleOnCloseModal() {
        setSelected("");
        setShow(false);
    }

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
        };

        setReactComponentinTable();
    }, []);

    const index = useCallback(() => {
        async function index() {
            try {
                const { data } = await api.get(
                    "/assets?_limit=-1&deleted=false"
                );

                const serializedData = data.map((asset) => {
                    const {
                        id,
                        name,
                        category: { name: category },
                    } = asset;

                    return {
                        id,
                        name,
                        category: category || "",
                        open: `<div class="editar" data-id="${id}" id="editar-${id}"></div>`,
                    };
                });

                DataTables(
                    "#assets-table",
                    serializedData,
                    [
                        { title: "Nome", data: "name" },
                        { title: "Categoria", data: "category" },
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
    }, [setReactComponentinTable]);

    useEffect(() => {
        index();
    }, [index]);

    return (
        <>
            <Modal
                {...{ show }}
                onClose={handleOnCloseModal}
                title={`${!selected ? "Nova" : ""} Átivo`}
            >
                <Assets {...{ selected, index, onClose: handleOnCloseModal }} />
            </Modal>
            <Container>
                <header>
                    <h1>Átivos</h1>
                    <div>
                        <AddButton
                            onClick={handleAddModal}
                            Icon={FaBox}
                            title="Cadastrar Átivo"
                        />
                        <AddButton
                            Sign={() => <></>}
                            onClick={() => {
                                history.push("/inventory-movements");
                            }}
                            Icon={FaDollyFlatbed}
                            title="Movimentações de Estoque"
                        />
                    </div>
                </header>
                <ResponsiveTable>
                    <Table id="assets-table"></Table>
                </ResponsiveTable>
            </Container>
        </>
    );
}

export default Index;
