import React, { useContext, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { File } from "react-og-forms";
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";

import { Container, ButtonsGrid } from "./styles";

import { Input, TextArea, Select } from "../../components/Form";
import Button from "../../components/Button";

import CategoriesContext from "../../components/Categories/context";
import UnitOfMeasurementContext from "../../components/UnitOfMeasurement/context";

import notification, { Error } from "../../modules/notifications";

import api from "../../services/api";
import Confirm from "../../modules/alertConfirm";

function Index({ selected, onClose, index }) {
    const { data: categories } = useContext(CategoriesContext);

    const { data: unitOfMeasurement } = useContext(UnitOfMeasurementContext);

    const [data, setData] = useState({
        name: "",
        category: "",
        description: "",
        quantity: "",
        unit_of_measurement: "",
        cost: "",
        images: [],
    });

    useEffect(() => {
        async function show() {
            try {
                if (!selected) {
                    setData({
                        name: "",
                        category: "",
                        description: "",
                        unit_of_measurement: "",
                        images: [],
                    });
                } else {
                    const response = await api.get(`/assets/${selected}`);

                    const { data } = response;

                    const {
                        id,
                        name,
                        description,
                        category: { id: category },
                        unit_of_measurement: { id: unit_of_measurement },
                        images,
                    } = data;

                    const serializedImages = images.map((image) => ({
                        ...image,
                        preview: `${api.defaults.baseURL}${image.url}`,
                    }));

                    setData({
                        id,
                        name,
                        description,
                        category,
                        unit_of_measurement,
                        images: serializedImages,
                    });
                }
            } catch (error) {
                Error(error);
            }
        }

        show();
    }, [selected]);

    async function create() {
        try {
            await api.post("/assets", data);

            notification("success", "Ativo cadastrado");
        } catch (error) {
            Error(error);
        }
    }

    async function update() {
        try {
            await api.put(`/assets/${data.id}`, data);

            notification("success", "Ativo alterado");
        } catch (error) {
            Error(error);
        }
    }

    function destroy() {
        Confirm(
            "Remover Alerta",
            "Tem certeza que deseja remover ?",
            async () => {
                try {
                    await api.put(`/assets/${data.id}`, { deleted: true });

                    notification("success", "Ativo removido");
                    index();
                    onClose();
                } catch (error) {
                    Error(error);
                }
            }
        );
    }

    function handleValidate() {
        if (!data.name) {
            return { status: false, message: "Nome é obrigatório" };
        }

        if (!data.category) {
            return { status: false, message: "Categoria é obrigatório" };
        }

        if (!data.unit_of_measurement) {
            return {
                status: false,
                message: "Unidade de Medida é obrigatório",
            };
        }

        return { status: true };
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validate = handleValidate();
        if (!validate.status) {
            return notification("warning", validate.message);
        }

        if (!selected) {
            await create();
        } else {
            await update();
        }

        index();
        onClose();
    }

    return (
        <Container onSubmit={handleSubmit}>
            <Col md="12" className="d-flex">
                <div className="assets-input-file">
                    <span>Imagens</span>
                    <File
                        accept="image/*"
                        value={data.images}
                        onChange={async (file) => {
                            setData({ ...data, images: file });

                            if (data.id) {
                                await api.put(`/assets/${data.id}`, {
                                    images: file,
                                });

                                index();
                            }
                        }}
                        baseUrl={api.defaults.baseURL}
                        headers={{
                            Authorization: localStorage.getItem("token"),
                        }}
                        multiple={true}
                        onDelete={async (id) => {
                            if (!data.id) return;

                            const filteredImages = data.images.filter(
                                (image) => image.id !== id
                            );

                            await api.put(`/assets/${data.id}`, {
                                images: filteredImages,
                            });

                            index();
                        }}
                    />
                </div>
            </Col>
            <Row>
                <Col md="4">
                    <Input
                        label="Nome*"
                        value={data.name}
                        onChange={(e) => {
                            setData({ ...data, name: e.target.value });
                        }}
                    />
                </Col>
                <Col md="4">
                    <Select
                        label="Categoria*"
                        value={data.category}
                        onChange={(e) => {
                            setData({ ...data, category: e.target.value });
                        }}
                    >
                        <option value="">Selecione...</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                </Col>
                <Col md="4">
                    <Select
                        label="Unid. de medida*"
                        value={data.unit_of_measurement}
                        onChange={(e) => {
                            setData({
                                ...data,
                                unit_of_measurement: e.target.value,
                            });
                        }}
                    >
                        <option value="">Selecione...</option>
                        {unitOfMeasurement.map((unity) => (
                            <option key={unity.id} value={unity.id}>
                                {unity.abbr ? unity.abbr : unity.name}
                            </option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Col md="12">
                <TextArea
                    label="Descrição"
                    value={data.description}
                    onChange={(e) => {
                        setData({ ...data, description: e.target.value });
                    }}
                />
            </Col>

            <ButtonsGrid>
                {Object.keys(selected).length === 0 ? (
                    <Button type="submit">
                        <FaPaperPlane />
                        Confirmar
                    </Button>
                ) : (
                    <>
                        <Button
                            color="var(--red-1)"
                            variant="secundary"
                            onClick={destroy}
                        >
                            <FaTrash />
                            Remover
                        </Button>
                        <Button type="submit">
                            <FaEdit />
                            Editar
                        </Button>
                    </>
                )}
            </ButtonsGrid>
        </Container>
    );
}

export default Index;
