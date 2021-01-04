import React, { useContext, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import $ from "jquery";
import "jquery-mask-plugin";
import { File } from "react-og-forms";
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";

import { Container, ButtonsGrid } from "./styles";

import { Input, TextArea, Select } from "../../components/Form";
import Button from "../../components/Button";

import CategoriesContext from "../../components/Categories/context";
import UnitOfMeasurementContext from "../../components/UnitOfMeasurement/context";

import notification, { Error } from "../../modules/notifications";

import api from "../../services/api";

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
        $("#cost").mask("#.##0,00", { reverse: true });
        $("#quantity").mask("##0,00", { reverse: true });
    }, []);

    useEffect(() => {
        if (Object.keys(selected).length === 0) {
            setData({
                name: "",
                category: "",
                description: "",
                quantity: "",
                unit_of_measurement: "",
                cost: "",
                images: [],
            });
        } else {
            const serializedImages = selected.images.map((image) => ({
                ...image,
                preview: `${api.defaults.baseURL}${image.url}`,
            }));

            setData({
                ...selected,
                images: serializedImages,
                category: selected.category.id,
                unit_of_measurement: selected.unit_of_measurement.id,
            });

            $("#quantity").val(
                $("#quantity").masked(parseFloat(selected.quantity).toFixed(2))
            );
            $("#cost").val(
                $("#cost").masked(parseFloat(selected.cost).toFixed(2))
            );
        }
    }, [selected]);

    function serializerData() {
        const cost = parseFloat(
            String(document.querySelector("#cost").value)
                .replace(".", "")
                .replace(",", ".")
        ).toFixed(2);

        const quantity = parseFloat(
            String(document.querySelector("#quantity").value).replace(",", ".")
        ).toFixed(2);

        return { ...data, cost, quantity };
    }

    async function create() {
        try {
            await api.post("/assets", serializerData());

            notification("success", "Átivo cadastrado");
        } catch (error) {
            Error(error);
        }
    }

    async function update() {
        try {
            await api.put(`/assets/${data.id}`, serializerData());

            notification("success", "Átivo alterado");
        } catch (error) {
            Error(error);
        }
    }

    async function destroy() {
        try {
            await api.put(`/assets/${data.id}`, { deleted: true });

            notification("success", "Átivo removido");
            index();
            onClose();
        } catch (error) {
            Error(error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (Object.keys(selected).length === 0) {
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
                <Col md="6">
                    <Input
                        label="Nome*"
                        value={data.name}
                        onChange={(e) => {
                            setData({ ...data, name: e.target.value });
                        }}
                    />
                </Col>
                <Col md="6">
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
            <Row>
                <Col md="4">
                    <Input label="Quantidade*" id="quantity" />
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
                <Col md="4">
                    <Input label="Custo" id="cost" />
                </Col>
            </Row>
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
