import React, { useState, useEffect, useContext } from "react";
import { Col, Row } from "react-bootstrap";
import { FaPaperPlane, FaTrash, FaEdit } from "react-icons/fa";
import $ from "jquery";
import "jquery-mask-plugin";

import Form, { Input, Select } from "../../components/Form";
import Button from "../../components/Button";

import AuthContext from "../../components/AuthContext";

import notifications, { Error } from "../../modules/notifications";

import api from "../../services/api";

import EmptyImage from "../../assets/images/empty.jpg";

import { Container } from "./styles";
import { Mask, fDate } from "../../modules/formatter";

function Index({ selected, onClose, reload }) {
    const initialData = {
        asset: "",
        type: "",
        quantity: "",
        createdAt: undefined,
    };

    const [assets, setAssets] = useState([]);

    const [selectedUnitOfMensurement, setSelectedUnitOfMensurement] = useState(
        ""
    );

    const [unitOfMeasurement, setUnitOfMeasurement] = useState([]);

    const {
        auth: { me },
    } = useContext(AuthContext);

    const [oldData, setOldData] = useState(initialData);

    const [data, setData] = useState(initialData);

    const [inventoryMovementLogs, setInventoryMovementLogs] = useState([]);

    useEffect(() => {
        $("#quantity").mask("##0,00", { reverse: true });
    }, []);

    useEffect(() => {
        async function showSelected() {
            try {
                if (!selected) {
                    setData({
                        asset: "",
                        type: 1,
                        quantity: "",
                        createdAt: "",
                    });

                    $("#quantity").val("");
                } else {
                    const { data } = await api.get(
                        `/inventory-movements/${selected}`
                    );

                    const {
                        asset: { id: asset },
                        type,
                        quantity,
                        inventory_movements_logs,
                        createdAt,
                        created_at,
                        createdBy,
                        assets_contribution,
                    } = data;

                    const selectedData = {
                        asset,
                        type: type ? 1 : 0,
                        createdAt: fDate(createdAt, "local-datetime"),
                        createdBy,
                        created_at,
                        inventory_movements_logs,
                        assets_contribution,
                    };

                    const formmatedQuantity = Mask(
                        parseFloat(quantity).toFixed(2),
                        "##0,00",
                        {
                            reverse: true,
                        }
                    );

                    $("#quantity").val(formmatedQuantity);

                    setData(selectedData);
                    setOldData({
                        ...selectedData,
                        quantity: formmatedQuantity,
                    });
                }
            } catch (error) {
                Error(error);
            }
        }

        showSelected();
    }, [selected]);

    useEffect(() => {
        async function indexWalletLogs() {
            try {
                const response = await api.get(
                    `/inventory-movements-logs?_limit=-1&inventory_movement=${selected}&_sort=created_at:DESC`
                );

                setInventoryMovementLogs(response.data);
            } catch (error) {
                Error(error);
            }
        }

        if (selected) indexWalletLogs();
    }, [selected]);

    useEffect(() => {
        async function indexUnitOfMensurement() {
            try {
                const response = await api.get(
                    "/unit-of-measurements?_limit=-1&deleted=false"
                );

                setUnitOfMeasurement(response.data);
            } catch (error) {
                Error(error);
            }
        }

        indexUnitOfMensurement();
    }, []);

    useEffect(() => {
        async function indexAssets() {
            const { data } = await api.get(
                "/assets?_limit=-1&deleted=false&_sort=name:ASC"
            );

            setAssets(data);
        }

        indexAssets();
    }, []);

    useEffect(() => {
        async function showAsset() {
            const {
                data: {
                    unit_of_measurement: { id },
                },
            } = await api.get(`/assets/${data.asset}`);

            setSelectedUnitOfMensurement(id);
        }

        if (data.asset) showAsset();
    }, [data, data.asset]);

    async function destroy() {
        try {
            await api.put(`/inventory-movements/${selected}`, {
                deleted: true,
            });

            notifications("success", "movimentação de Estoque removida");

            onClose();
            reload();
        } catch (error) {
            Error(error);
        }
    }

    function serializeData() {
        const quantity = parseFloat(
            String(document.querySelector("#quantity").value)
                .replace(".", "")
                .replace(",", ".")
        ).toFixed(2);

        return {
            ...data,
            asset: parseInt(data.asset),
            quantity,
            type: parseInt(data.type) === 1 && true,
        };
    }

    function handleValidate(data) {
        if (!data.asset) {
            return { status: false, message: "Átivo é obrigatório" };
        }

        if (isNaN(data.quantity)) {
            return { status: false, message: "Quantidade é obrigatório" };
        }

        return { status: true };
    }

    async function create(data) {
        try {
            await api.post("/inventory-movements", {
                ...data,
                createdBy: me.id,
            });

            notifications("success", "Movimentação de Estoque cadastrada");
        } catch (error) {
            Error(error);
        }
    }

    function handleValidateUpdate(data) {
        let response = { status: false, message: "" };

        if (data.asset !== oldData.asset) {
            const { name: oldAsset } = assets.filter(
                (asset) => asset.id === oldData.asset
            )[0];

            const { name: newAsset } = assets.filter(
                (asset) => asset.id === parseInt(data.asset)
            )[0];

            let message = `alterou o átivo de "${oldAsset}" para "${newAsset}"`;

            response = { status: true, message };
        }

        if (data.createdAt !== oldData.createdAt) {
            let message = `${
                response.message ? " e " : ""
            }alterou Data e Hora de ${new Date(oldData.createdAt)
                .toLocaleString()
                .slice(0, 16)} para ${new Date(data.createdAt)
                .toLocaleString()
                .slice(0, 16)}`;

            response.status = true;
            response.message += message;
        }

        const oldType = oldData.type === 1 && true;
        if (data.type !== oldType) {
            let message = `${response.message ? " e " : ""}alterou tipo de ${
                oldType ? "Entrada" : "Saída"
            } para ${data.type ? "Entrada" : "Saída"}`;

            response.status = true;
            response.message += message;
        }

        const oldQuantity = parseFloat(
            String(oldData.quantity).replace(",", ".")
        ).toFixed(2);
        if (data.quantity !== oldQuantity) {
            let message = `${
                response.message ? " e " : ""
            } alterou a quantidade de ${Mask(
                parseFloat(oldQuantity).toFixed(2),
                "##0,00",
                { reverse: true }
            )} para ${Mask(parseFloat(data.quantity).toFixed(2), "##0,00", {
                reverse: true,
            })}`;

            response.status = true;
            response.message += message;
        }

        return response;
    }

    async function update(data) {
        try {
            const validate = handleValidateUpdate(data);
            if (!validate.status) return;

            await api.put(`/inventory-movements/${selected}`, data);

            await api.post("/inventory-movements-logs", {
                inventory_movement: selected,
                text: validate.message,
                createdBy: me.id,
                createdAt: new Date(),
            });

            if (data.assets_contribution) {
                await api.put(
                    `/assets-contributions/${data.assets_contribution.id}`,
                    { quantity: data.quantity }
                );
            }

            notifications("success", "Movimentação de Estoque atualizada");
        } catch (error) {
            Error(error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const serializedData = serializeData();

        const validate = handleValidate(serializedData);
        if (!validate.status) return notifications("warning", validate.message);

        if (!selected) {
            await create(serializedData);
        } else {
            await update(serializedData);
        }

        onClose();
        reload();
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={7}>
                        <Select
                            label="Átivo*"
                            name="asset"
                            id="asset"
                            value={data.asset}
                            onChange={(e) => {
                                setData({ ...data, asset: e.target.value });
                            }}
                        >
                            <option value="">Selecione...</option>
                            {assets.map((asset) => (
                                <option key={asset.id} value={asset.id}>
                                    {asset.name}
                                </option>
                            ))}
                        </Select>
                    </Col>
                    <Col md={5}>
                        <Input
                            label="Data e Hora"
                            type="datetime-local"
                            value={data.createdAt}
                            onChange={(e) => {
                                setData({ ...data, createdAt: e.target.value });
                            }}
                        />
                    </Col>
                    <Col md={4}>
                        <Select
                            label="Tipo*"
                            name="type"
                            id="type"
                            value={data.type}
                            onChange={(e) => {
                                setData({ ...data, type: e.target.value });
                            }}
                        >
                            <option value={1}>Entrada</option>
                            <option value={0}>Saída</option>
                        </Select>
                    </Col>
                    <Col md={4}>
                        <Input
                            label="Quantidade*"
                            name="quantity"
                            id="quantity"
                        />
                    </Col>
                    <Col md={4}>
                        <Select
                            label="Un. de Medida"
                            name="unit-of-measurement"
                            id="unit-of-measurement"
                            value={selectedUnitOfMensurement}
                            disabled
                        >
                            <option value="">Selecione...</option>
                            {unitOfMeasurement.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.name}
                                </option>
                            ))}
                        </Select>
                    </Col>
                </Row>

                {selected && data.createdBy && (
                    <Col className="movement-history">
                        {inventoryMovementLogs.map((log) => (
                            <section key={log.id}>
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
                                            {log.createdBy.username}
                                        </strong>{" "}
                                        {log.text}
                                    </p>
                                </div>
                                <span className="created-at">
                                    {new Date(log.createdAt)
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
                                {new Date(data.created_at)
                                    .toLocaleString()
                                    .slice(0, 16)}
                            </span>
                        </footer>
                    </Col>
                )}

                <Row className="d-flex justify-content-center">
                    {!selected ? (
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
