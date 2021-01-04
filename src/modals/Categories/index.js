import React, { useState, useEffect } from "react";
import { FaPaperPlane, FaTrash, FaEdit } from "react-icons/fa";

import { Input } from "../../components/Form";
import Button from "../../components/Button";

import notification, { Error } from "../../modules/notifications";

import api from "../../services/api";

import { Container } from "./styles";

function Index({ onClose, reload, selected, handleValidate }) {
    const initialValues = {
        name: "",
    };

    const [data, setData] = useState(initialValues);

    useEffect(() => {
        if (Object.keys(selected).length === 0) {
            setData({
                name: "",
            });
        } else {
            setData(selected);
        }
    }, [selected]);

    async function create() {
        try {
            await api.post("/categories", data);

            notification("success", "Categoria cadastrada");
        } catch (error) {
            Error(error);
        }
    }

    async function update() {
        try {
            await api.put(`/categories/${data.id}`, data);

            notification("success", "Categoria atualizada");
        } catch (error) {
            Error(error);
        }
    }

    async function destroy() {
        try {
            await api.put(`/categories/${data.id}`, { deleted: true });

            notification("success", "Categoria atualizada");
            reload();
            onClose();
        } catch (error) {
            Error(error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validate = handleValidate(data.name);
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
                placeholder="Entre com o nome da categoria"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
            />
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
        </Container>
    );
}

export default Index;
