import React, { useState, useContext } from "react";
import { FaFolder } from "react-icons/fa";

import Table, { ResponsiveTable } from "../Table";
import AddButton from "../AddButton";
import Modal from "../Modal";

import Context from "./context";

import CategoriesModal from "../../modals/Categories";

import { Container } from "./styles";

function Index() {
    const [show, setShow] = useState(false);

    const { data, index } = useContext(Context);

    const [selected, setSelected] = useState({});

    function handleValidate(name) {
        if (!name) {
            return { status: false, message: "Nome é obrigatório" };
        }

        const serializedData = data.map((item) => item.name);

        if (serializedData.includes(name)) {
            return { status: false, message: "Categoria já existe" };
        }

        return { status: true };
    }

    function handleOnCloseModal() {
        setSelected({});
        setShow(false);
    }

    function handleAddModal() {
        setSelected({});
        setShow(true);
    }

    function handleOpenModal(data) {
        setSelected(data);
        setShow(true);
    }

    return (
        <>
            <Modal
                {...{ show }}
                onClose={handleOnCloseModal}
                title={`${
                    Object.keys(selected).length === 0 ? "Nova" : selected.name
                } categoria`}
            >
                <CategoriesModal
                    onClose={handleOnCloseModal}
                    reload={index}
                    {...{ selected, handleValidate }}
                />
            </Modal>
            <Container>
                <header>
                    <h1>Categorias</h1>
                    <AddButton onClick={handleAddModal} />
                </header>
                {data.length !== 0 && (
                    <ResponsiveTable>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th className="d-flex justify-content-center">
                                        Abrir
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((category) => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td className="d-flex justify-content-center">
                                            <FaFolder
                                                className="open-icon"
                                                onClick={() => {
                                                    handleOpenModal(category);
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
