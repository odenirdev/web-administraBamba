import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaTrash, FaEdit } from "react-icons/fa";

import { Input } from "../../components/Form";
import Button from "../../components/Button";

import notification, { Error } from "../../modules/notifications";

import api from "../../services/api";

import { Container, ButtonsGrid } from "./styles";

function Index({ onClose, reload, selected }) {
    const [data, setData] = useState({});

    useEffect(() => {
        if (Object.keys(selected).length === 0) {
            setData({
                name: "",
                abbr: "",
            });
        } else {
            setData(selected);
        }
    }, [selected]);

    async function create() {
        try {
            await api.post("/unit-of-measurements", data);

            notification("success", "Unidade de medida cadastrada");
        } catch (error) {
            Error(error);
        }
    }

    async function update() {
        try {
            await api.put(`/unit-of-measurements/${data.id}`, data);

            notification("success", "Unidade de medida alterada");
        } catch (error) {
            Error(error);
        }
    }

    async function destroy() {
        try {
            await api.put(`/unit-of-measurements/${data.id}`, {
                deleted: true,
            });

            notification("success", "Unidade de medida removida");
            reload();
            onClose();
        } catch (error) {
            Error(error);
        }
    }

    async function handleValidate() {
        try {
            if (!data.name) {
                return { status: false, message: "Nome é obrigatório" };
            }

            const response = await api.get(
                `/unit-of-measurements?deleted=false&name=${data.name}`
            );

            if (response.data.length !== 0) {
                const unity = response.data[0];
                if (unity.id !== data.id) {
                    return {
                        status: false,
                        message: "Unidade de medida já existe",
                    };
                }
            }

            if (data.abbr) {
                const response = await api.get(
                    `/unit-of-measurements?deleted=false&abbr=${data.abbr}`
                );

                if (response.data.length !== 0) {
                    const unity = response.data[0];
                    if (unity.id !== data.id) {
                        return {
                            status: false,
                            message: "Abreviação já existe",
                        };
                    }
                }
            }

            return { status: true };
        } catch (error) {
            Error(error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validate = await handleValidate();
        if (!validate.status) {
            return notification("warning", validate.message);
        }

        if (Object.keys(selected).length === 0) {
            await create();
        } else {
            await update();
        }

        reload();
        onClose();
    }

    return (
        <Container onSubmit={handleSubmit}>
            <Input
                label="Nome*"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
            />
            <Input
                label="Abreviação"
                value={data.abbr}
                onChange={(e) => setData({ ...data, abbr: e.target.value })}
            />
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
