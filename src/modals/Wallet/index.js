import React, { useState, useEffect, useContext, useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import { FaPaperPlane, FaTrash, FaEdit } from "react-icons/fa";
import $ from "jquery";
import "jquery-mask-plugin";

import { Container } from "./styles";

import Form, { Input, TextArea } from "../../components/Form";
import Button from "../../components/Button";

import AuthContext from "../../components/AuthContext";

import notification, { Error } from "../../modules/notifications";
import { fDate, Mask } from "../../modules/formatter";

import api from "../../services/api";

function Index({ type, onClose, selectedWallet, reload }) {
    const {
        auth: { me },
    } = useContext(AuthContext);

    const [data, setData] = useState({});

    const [movementHistory, setMovementHistory] = useState([]);

    const indexWalletLogs = useCallback(() => {
        async function indexWalletLogs() {
            try {
                const response = await api.get(
                    `/wallet-logs?_limit=-1&wallet=${data.id}&_sort=id:DESC`
                );

                setMovementHistory(response.data);
            } catch (error) {
                Error(error);
            }
        }

        if (data.id) indexWalletLogs();
    }, [data.id]);

    useEffect(() => {
        $("input[name=price]").mask("#.##0,00", { reverse: true });
    }, []);

    useEffect(() => {
        if (!(Object.keys(selectedWallet).length === 0)) {
            document.querySelector("input[name=price]").value = $(
                "input[name=price]"
            ).masked(parseFloat(selectedWallet.price).toFixed(2));

            setData({
                ...selectedWallet,
                createdAt: fDate(selectedWallet.createdAt, "local-datetime"),
            });

            indexWalletLogs();
        } else {
            clearData();
        }
    }, [indexWalletLogs, selectedWallet]);

    function handleOnChange(event) {
        const { name, value } = event.currentTarget;

        setData({ ...data, [name]: value });
    }

    function clearData() {
        document.querySelector("input[name=price]").value = "";

        setData({
            createdAt: "",
            reason: "",
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
            type,
        };
    }

    function handleValidate(data) {
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
                `${type === 1 ? "Entrada" : "Saída"} de dinheiro concluída`
            );
        } catch (error) {
            Error(error);
        }
    }

    async function handleLogUpdate(data) {
        let text = "";

        if (
            Mask(parseFloat(data.price).toFixed(2), "#.##0,00", {
                reverse: true,
            }) !==
            Mask(parseFloat(selectedWallet.price).toFixed(2), "#.##0,00", {
                reverse: true,
            })
        ) {
            text = `alterou o valor de R$ ${Mask(
                parseFloat(selectedWallet.price).toFixed(2),
                "#.##0,00",
                { reverse: true }
            )} para ${Mask(parseFloat(data.price).toFixed(2), "#.##0,00", {
                reverse: true,
            })}`;
        }

        if (
            new Date(data.createdAt).toLocaleString().slice(0, 16) !==
            new Date(selectedWallet.createdAt).toLocaleString().slice(0, 16)
        ) {
            text += `${
                text ? " e " : ""
            }altorou a data e o horário de ${new Date(selectedWallet.createdAt)
                .toLocaleString()
                .slice(0, 16)} para ${new Date(data.createdAt)
                .toLocaleString()
                .slice(0, 16)}`;
        }

        if (data.reason !== selectedWallet.reason) {
            text += `${text ? " e " : ""}altorou o motivo de "${
                selectedWallet.reason
            }" para "${data.reason}"`;
        }

        await api.post("/wallet-logs", {
            createdBy: me.id,
            createdAt: new Date(),
            wallet: data.id,
            text,
        });
    }

    function handleUpdateValidation(data) {
        if (
            Mask(parseFloat(data.price).toFixed(2), "#.##0,00", {
                reverse: true,
            }) ===
                Mask(parseFloat(selectedWallet.price).toFixed(2), "#.##0,00", {
                    reverse: true,
                }) &&
            new Date(data.createdAt).toLocaleString().slice(0, 16) ===
                new Date(selectedWallet.createdAt)
                    .toLocaleString()
                    .slice(0, 16) &&
            data.reason === selectedWallet.reason
        ) {
            return false;
        }

        return true;
    }

    async function update(data) {
        try {
            if (!handleUpdateValidation(data)) {
                return;
            }

            console.log("here");

            await api.put(`/wallets/${data.id}`, data);

            await handleLogUpdate(data);

            notification(
                "success",
                `${type === 1 ? "Entrada" : "Saída"} de dinheiro atualizado`
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
                `${type === 1 ? "Entrada" : "Saída"} de dinheiro removida`
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
                    <Col>
                        <Input type="text" label="Valor*" name="price" />
                    </Col>
                    <Col>
                        <Input
                            type="datetime-local"
                            label="Data e Horário*"
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
                                                src={`${api.defaults.baseURL}${movement.createdBy.image.url}`}
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
                                        src={`${api.defaults.baseURL}${data.createdBy.image.url}`}
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
