import React, { useState, useEffect, useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { FaPaperPlane, FaTrash, FaEdit } from "react-icons/fa";
import $ from "jquery";
import "jquery-mask-plugin";

import { Container } from "./styles";

import Form, { Input, TextArea, Select } from "../../components/Form";
import Button from "../../components/Button";

import AuthContext from "../../components/AuthContext";

import notification, { Error } from "../../modules/notifications";
import { fDate, Mask } from "../../modules/formatter";

import api from "../../services/api";

import EmptyImage from "../../assets/images/empty.jpg";

function Index({ onClose, selectedWallet, reload }) {
    const {
        auth: { me },
    } = useContext(AuthContext);

    const [data, setData] = useState({});

    const [oldData, setOldData] = useState({});

    const [movementHistory, setMovementHistory] = useState([]);

    useEffect(() => {
        async function indexWalletLogs() {
            try {
                const response = await api.get(
                    `/wallet-logs?_limit=-1&wallet=${selectedWallet}&_sort=id:DESC`
                );

                setMovementHistory(response.data);
            } catch (error) {
                Error(error);
            }
        }

        if (selectedWallet) indexWalletLogs();
    }, [selectedWallet]);

    useEffect(() => {
        $("input[name=price]").mask("#.##0,00", { reverse: true });
    }, []);

    useEffect(() => {
        async function show() {
            try {
                const { data } = await api.get(`/wallets/${selectedWallet}`);

                document.querySelector("input[name=price]").value = $(
                    "input[name=price]"
                ).masked(parseFloat(data.price).toFixed(2));

                const serializedData = {
                    ...data,
                    createdAt: fDate(data.createdAt, "local-datetime"),
                };

                setOldData(serializedData);
                setData(serializedData);
            } catch (error) {
                Error(error);
            }
        }

        if (selectedWallet) {
            show();
        } else {
            clearData();
        }
    }, [selectedWallet]);

    function handleOnChange(event) {
        const { name, value } = event.currentTarget;

        setData({ ...data, [name]: value });
    }

    function clearData() {
        document.querySelector("input[name=price]").value = "";

        setData({
            createdAt: "",
            reason: "",
            type: "",
        });
    }

    function serializedData() {
        const priceEl = $("input[name=price]");
        const price = parseFloat(
            String(priceEl.val()).replace(".", "").replace(",", ".")
        ).toFixed(2);

        return {
            ...data,
            price,
        };
    }

    function handleValidate(data) {
        if (data.type === "") {
            return { status: false, message: "Tipo é obrigatório" };
        }

        if (data.price === "NaN") {
            return { status: false, message: "Valor é obrigatório" };
        }

        if (!data.createdAt) {
            return {
                status: false,
                message: "Data e Horário são obrigatórios",
            };
        }

        if (!data.reason) {
            return { status: false, message: "Motivo é obrigatório" };
        }

        return { status: true };
    }

    async function create(data) {
        try {
            await api.post("/wallets", { ...data, createdBy: me.id });

            notification(
                "success",
                `${data.type === 1 ? "Entrada" : "Saída"} de dinheiro concluída`
            );
        } catch (error) {
            Error(error);
        }
    }

    async function handleLogUpdate(text) {
        await api.post("/wallet-logs", {
            createdBy: me.id,
            createdAt: new Date(),
            wallet: selectedWallet,
            text,
        });
    }

    function handleUpdateValidation(data) {
        let response = { status: false, message: "" };

        const type = parseInt(data.type);
        const oldType = parseInt(oldData.type);
        if (type !== oldType) {
            response.status = true;
            response.message = `alterou o tipo de ${
                oldType === 1 ? "Entrada" : "Saída"
            } para ${type === 1 ? "Entrada" : "Saída"}`;
        }

        const price = Mask(parseFloat(data.price).toFixed(2), "#.##0,00", {
            reverse: true,
        });
        const oldPrice = Mask(
            parseFloat(oldData.price).toFixed(2),
            "#.##0,00",
            {
                reverse: true,
            }
        );
        if (price !== oldPrice) {
            response.status = true;
            response.message += `${
                response.message ? " e " : ""
            }alterou o valor de ${oldPrice} para ${price}`;
        }

        const createdAt = new Date(data.createdAt)
            .toLocaleString()
            .slice(0, 16);
        const oldCreatedAt = new Date(oldData.createdAt)
            .toLocaleString()
            .slice(0, 16);
        if (createdAt !== oldCreatedAt) {
            response.status = true;
            response.message += `${
                response.message ? " e " : ""
            }alterou a data e a hora de ${oldCreatedAt} para ${createdAt}`;
        }

        if (data.reason !== oldData.reason) {
            response.status = true;
            response.message += `${
                response.message ? " e " : ""
            }alterou o motivo de "${oldData.reason}" para "${data.reason}"`;
        }

        return response;
    }

    async function update(data) {
        try {
            const validate = handleUpdateValidation(data);
            if (!validate.status) {
                return;
            }
            await api.put(`/wallets/${data.id}`, data);

            await handleLogUpdate(validate.message);

            notification(
                "success",
                `${
                    data.type === 1 ? "Entrada" : "Saída"
                } de dinheiro atualizado`
            );
        } catch (error) {
            Error(error);
        }
    }

    async function destroy() {
        try {
            await api.put(`/wallets/${data.id}`, { deleted: true });

            notification(
                "success",
                `${data.type === 1 ? "Entrada" : "Saída"} de dinheiro removida`
            );

            reload();
            onClose();
        } catch (error) {
            Error(error);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const data = serializedData();

        const validate = handleValidate(data);
        if (!validate.status) {
            return notification("warning", validate.message);
        }

        if (!data.id) {
            await create(data);
        } else {
            await update(data);
        }

        clearData();
        onClose();
        reload();
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md="3">
                        <Select
                            label="Tipo*"
                            name="type"
                            value={data.type}
                            onChange={handleOnChange}
                        >
                            <option value="">Selecione...</option>
                            <option value={1}>Entrada</option>
                            <option value={0}>Saída</option>
                        </Select>
                    </Col>
                    <Col md="3">
                        <Input type="text" label="Valor*" name="price" />
                    </Col>
                    <Col md="6">
                        <Input
                            type="datetime-local"
                            label="Data e Hora*"
                            name="createdAt"
                            value={data.createdAt}
                            onChange={handleOnChange}
                        />
                    </Col>
                </Row>
                <TextArea
                    label="Motivo*"
                    name="reason"
                    value={data.reason}
                    onChange={handleOnChange}
                    maxLength={280}
                />

                {data.id && (
                    <Col className="movement-history">
                        {movementHistory.length !== 0 &&
                            movementHistory.map((movement) => (
                                <section key={movement.id}>
                                    <div>
                                        <p>
                                            <img
                                                src={
                                                    !!Object.keys(
                                                        data.createdBy.image
                                                    ).length
                                                        ? `${api.defaults.baseURL}${data.createdBy.image.url}`
                                                        : EmptyImage
                                                }
                                                alt="Creator of movement"
                                            />{" "}
                                            <strong>
                                                {movement.createdBy.username}
                                            </strong>{" "}
                                            {movement.text}
                                        </p>
                                    </div>
                                    <span className="created-at">
                                        {new Date(movement.createdAt)
                                            .toLocaleString()
                                            .slice(0, 16)}
                                    </span>
                                </section>
                            ))}
                        <footer>
                            <div>
                                <p>
                                    <img
                                        src={
                                            !!Object.keys(data.createdBy.image)
                                                .length
                                                ? `${api.defaults.baseURL}${data.createdBy.image.url}`
                                                : EmptyImage
                                        }
                                        alt="Creator of movement"
                                    />{" "}
                                    <strong>{data.createdBy.username}</strong>{" "}
                                    adicionou está movimentação
                                </p>
                            </div>
                            <span>
                                {new Date(data.createdAt)
                                    .toLocaleString()
                                    .slice(0, 16)}
                            </span>
                        </footer>
                    </Col>
                )}

                <Row className="d-flex justify-content-center">
                    {!data.id ? (
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
                </Row>
            </Form>
        </Container>
    );
}

export default Index;
