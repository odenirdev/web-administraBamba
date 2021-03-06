import React, { useEffect, useState, useContext, useCallback } from "react";
import { Row } from "react-bootstrap";
import { Switch } from "react-og-forms";
import {
    FaEdit,
    FaTrash,
    FaPaperPlane,
    FaAngleLeft,
    FaAngleRight,
} from "react-icons/fa";
import $ from "jquery";
import "jquery-mask-plugin";

import Form, {
    Input,
    GridButtons,
    TextArea,
    FormItem,
} from "../../components/Form";
import Button from "../../components/Button";
import SelectContributors from "../../components/SelectContributors";
import SelectAssets from "../../components/SelectAssets";

import Api from "../../services/api";
import Firebase from "../../services/firebase";

import Notification, { Error } from "../../modules/notifications";
import { Mask } from "../../modules/formatter";
import System from "../../modules/system";

import AuthContext from "../../components/AuthContext";
import BoardContext from "../../components/Board/context";

import { Container, StatusButton, MoneyIn } from "./styles";
import api from "../../services/api";

const Index = ({ id, onClose, indexList }) => {
    const initalData = {
        title: "",
        dueDate: "Y-m-d",
        createdAt: "Y-m-d",
        description: "",
    };

    const [data, setData] = useState(initalData);

    const [users, setUsers] = useState([]);

    const [board, setBoard] = useState({});

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [oldSelectedUsers, setOldSelectedUsers] = useState([]);

    const [createEvent, setCreateEvent] = useState(false);

    const [selectedAssets, setSelectedAssets] = useState([]);

    const {
        auth: { me },
    } = useContext(AuthContext);

    const {
        data: { lists, id: idBoard },
        index: indexBoard,
    } = useContext(BoardContext);

    useEffect(() => {
        $("input[name=money-contribution]").mask("#.##0,00", {
            reverse: true,
        });
    }, []);

    const clearData = useCallback(() => {
        const initalData = {
            title: "",
            dueDate: "Y-m-d",
            createdAt: "Y-m-d",
            description: "",
        };

        setData(initalData);

        $("input[name=money-contribution]").val("");
        setSelectedAssets([]);
        setSelectedUsers([]);
        setCreateEvent(false);
    }, []);

    useEffect(() => {
        async function showTask() {
            try {
                const response = await Api.get(`/tasks/${id}`);

                let task = response.data;

                let usersContributing = [];
                usersContributing = task.users.map((user) => ({
                    value: user.id,
                    username: user.username,
                    email: user.email,
                    image: user.image.url,
                }));

                setOldSelectedUsers(usersContributing);

                setSelectedUsers(usersContributing);

                if (task.event && Object.keys(task.event).length !== 0) {
                    setCreateEvent(true);
                } else {
                    setCreateEvent(false);
                }

                task.wallet =
                    task.wallet && !task.wallet.deleted ? task.wallet : {};

                const price = task.wallet
                    ? parseFloat(task.wallet.price).toFixed(2)
                    : undefined;

                const priceEl = $("input[name=money-contribution]");
                priceEl[indexList].value = Mask(price, "#.##0,00", {
                    reverse: true,
                });

                const serializedAssetsContribution = task[
                    "assets_contributions"
                ].map((item) => {
                    return {
                        ...item,
                        asset: { id: item.asset },
                        quantity: Mask(
                            parseFloat(item.quantity).toFixed(2),
                            "##0,00",
                            {
                                reverse: true,
                            }
                        ),
                    };
                });

                setSelectedAssets(serializedAssetsContribution);

                setData({
                    ...task,
                    event: task.event && task.event.id,
                    creator: task.creator.id,
                });
            } catch (error) {
                Error(error);
            }
        }

        if (id) {
            showTask();
        } else {
            clearData();
        }
    }, [clearData, id, idBoard, indexList]);

    useEffect(() => {
        async function showBoard() {
            const response = await Api.get(`/boards/${idBoard}`);

            setBoard(response.data);
        }

        showBoard();
    }, [idBoard]);

    useEffect(() => {
        if (Array.isArray(board.users)) {
            let contributorsUsers = board.users.map((user) => ({
                value: user.id,
                username: user.username,
                email: user.email,
                image: user.image.url,
            }));

            contributorsUsers = [
                ...contributorsUsers,
                {
                    value: board.creator.id,
                    username: board.creator.username,
                    email: board.creator.email,
                    image: board.creator.image.url,
                },
            ];

            setUsers(contributorsUsers);
        }
    }, [board, id]);

    function handleUpdateNotifications(data) {
        const newDataUsers = data.users;

        const oldDataUsers = oldSelectedUsers.map((user) =>
            parseInt(user.value)
        );

        const addedUsers = newDataUsers.filter(
            (user) => !oldDataUsers.includes(user)
        );

        const removedUsers = oldDataUsers.filter(
            (user) => !newDataUsers.includes(user)
        );

        addedUsers.forEach((user) => {
            Firebase.child("notifications").push(
                {
                    title: "Contribuição adicionada",
                    description: `Você está contribuindo para um novo quadro "${board.title}"`,
                    saw: false,
                    to_url: `/board/${board.id}`,
                    to: user,
                },
                (error) => {
                    if (error) {
                        Error(error);
                    }
                }
            );
        });

        removedUsers.forEach((user) => {
            Firebase.child("notifications").push(
                {
                    title: "Contribuição removida",
                    description: `Você não está mais contribuindo para quadro ${board.title}`,
                    saw: false,
                    to_url: "",
                    to: user,
                },
                (error) => {
                    if (error) {
                        Error(error);
                    }
                }
            );
        });
    }

    async function createMoneyContribution() {
        const priceEl = $("input[name=money-contribution]");
        const price = parseFloat(
            String(priceEl[indexList].value)
                .replaceAll(".", "")
                .replace(",", ".")
        ).toFixed(2);

        if (!price || isNaN(price)) return;

        const response = await api.post("/wallets", {
            price,
            type: 0,
            reason: `Dinheiro de contribuição para a tarefa "${data.title}"`,
            createdBy: me.id,
            createdAt: new Date(),
        });

        return response.data.id;
    }

    async function handleLogUpdateMoneyContribution(
        oldPrice,
        newPrice,
        wallet
    ) {
        const text = `alterou o valor de R$ ${Mask(
            parseFloat(oldPrice).toFixed(2),
            "#.##0,00",
            { reverse: true }
        )} para ${Mask(parseFloat(newPrice).toFixed(2), "#.##0,00", {
            reverse: true,
        })}`;

        await api.post("/wallet-logs", {
            createdBy: me.id,
            createdAt: new Date(),
            wallet,
            text,
        });
    }

    async function updateMoneyContribution() {
        if (data.wallet && Object.keys(data.wallet).length !== 0) {
            const priceEl = $("input[name=money-contribution]");
            const price = parseFloat(
                String(priceEl[indexList].value)
                    .replaceAll(".", "")
                    .replace(",", ".")
            ).toFixed(2);

            if (price === parseFloat(data.wallet.price).toFixed(2)) {
                return;
            }

            await api.put(`/wallets/${data.wallet.id}`, { price });

            await handleLogUpdateMoneyContribution(
                data.wallet.price,
                price,
                data.wallet.id
            );

            return 0;
        } else {
            return await createMoneyContribution();
        }
    }

    async function createAssetsContribution(task) {
        selectedAssets.forEach(async (item) => {
            if (parseFloat(item.quantity) === 0) return;

            const {
                data: { id: inventory_movement },
            } = await api.post("/inventory-movements", {
                asset: item.asset.id,
                type: false,
                quantity: parseFloat(item.quantity).toFixed(2),
                createdAt: new Date(),
                createdBy: me.id,
            });

            await api.post("/assets-contributions", {
                asset: item.asset.id,
                quantity: parseFloat(item.quantity).toFixed(2),
                createdAt: new Date(),
                createdBy: me.id,
                task,
                inventory_movement,
            });
        });
    }

    async function updateAssetsContribution(task) {
        selectedAssets.forEach(async (item) => {
            if (item.id || parseFloat(item.quantity) === 0) return;

            const {
                data: { id: inventory_movement },
            } = await api.post("/inventory-movements", {
                asset: item.asset.id,
                type: false,
                quantity: parseFloat(item.quantity).toFixed(2),
                createdAt: new Date(),
                createdBy: me.id,
            });

            await api.post("/assets-contributions", {
                asset: item.asset.id,
                quantity: parseFloat(item.quantity).toFixed(2),
                createdAt: new Date(),
                createdBy: me.id,
                task,
                inventory_movement,
            });
        });
    }

    async function create(data) {
        try {
            const createData = {
                ...data,
                board: idBoard,
                creator: me.id,
                list: 1,
                position: lists[1].tasks.length,
                wallet: await createMoneyContribution(),
            };

            const response = await Api.post("/tasks", createData);

            await createAssetsContribution(response.data.id);

            selectedUsers.forEach((item) => {
                Firebase.child("notifications").push(
                    {
                        title: "Contribuição adicionada",
                        description: `Você está contribuindo para uma novo tarefa "${data.title}"`,
                        saw: false,
                        to_url: `/board/${idBoard}`,
                        to: item.value,
                    },
                    (error) => {
                        if (error) {
                            Error(error);
                        }
                    }
                );
            });

            indexBoard();
            onClose();
            clearData();
            Notification("success", "Tarefa cadastrada");
        } catch (error) {
            Error(error);
        }
    }

    async function update(data) {
        try {
            const wallet = await updateMoneyContribution();

            let updateData = data;

            if (wallet > 0) {
                updateData.wallet = wallet;
            }

            await Api.put(`/tasks/${data.id}`, data);

            await updateAssetsContribution(data.id);

            handleUpdateNotifications(data);

            indexBoard();
            onClose();
            clearData();
            Notification("success", "Tarefa atualizada");
        } catch (error) {
            Error(error);
        }
    }

    async function destroy() {
        try {
            if (data.event) {
                await Api.put(`/events/${data.event}`, { deleted: true });
            }

            await Api.put(`/tasks/${id}`, { deleted: true });

            selectedUsers.forEach((item) => {
                Firebase.child("notifications").push(
                    {
                        title: "Contribuição removida",
                        description: `Tarefa '${data.title}' foi removida por ${me.username}`,
                        saw: false,
                        to_url: `/board/${idBoard}`,
                        to: item.value,
                    },
                    (error) => {
                        if (error) {
                            Error(error);
                        }
                    }
                );
            });

            indexBoard();
            clearData();
            onClose();
            Notification("success", "Tarefa removido");
        } catch (error) {
            Error(error);
        }
    }

    function serializerDataEvent(data) {
        let {
            title: subject,
            description,
            users,
            dueDate: endTime,
            createdAt,
        } = data;

        if (!users.includes(me.id)) {
            users.push(me.id);
        }

        return {
            subject,
            description,
            startTime: createdAt ? createdAt : new Date().setHours(0, 0),
            endTime: endTime
                ? `${endTime}T23:59:59`
                : new Date(createdAt ? createdAt : new Date()).setHours(0, 0),
            users,
            isAllDay: true,
            isReadOnly: true,
        };
    }

    async function handleCreateEvent(data) {
        try {
            const response = await Api.post(
                "/events",
                serializerDataEvent(data)
            );

            return response.data;
        } catch (error) {
            Error(error);
        }
    }

    async function handleUpdateEvent(data, id) {
        try {
            await Api.put(`/events/${id}`, serializerDataEvent(data));
        } catch (error) {
            Error(error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!data.title) {
            return Notification("warning", "Título é obrigatório");
        }

        if (!data.createdAt) {
            return Notification("warning", "Início é obrigatório");
        }

        if (
            data.dueDate &&
            new Date(data.dueDate).getTime() <
                new Date(data.createdAt).getTime()
        ) {
            return Notification(
                "warning",
                "Vencimento deve ser maior ou igual a Início"
            );
        }

        let requestData;
        const users = selectedUsers.map((user) => user.value);

        requestData = { ...data, users };

        if (requestData.dueDate === "Y-m-d") {
            delete requestData.dueDate;
        }

        if (createEvent) {
            if (data.event) {
                handleUpdateEvent(requestData, data.event);
            } else {
                const event = await handleCreateEvent(requestData);

                requestData = { ...requestData, event: event.id };
            }
        } else {
            if (data.event) {
                await Api.put(`/events/${data.event}`, { deleted: true });
            }

            requestData.event = "";
        }

        if (data.wallet) {
            requestData.wallet = data.wallet.id;
        }

        if (requestData.id) {
            update(requestData);
            return;
        }

        return create(requestData);
    }

    async function handleNext() {
        try {
            await Api.put(`/tasks/${data.id}`, { status: data.status + 1 });

            onClose();
            indexBoard();
        } catch (error) {
            Error(error);
        }
    }

    async function handlePrevious() {
        try {
            await Api.put(`/tasks/${data.id}`, { status: data.status - 1 });

            onClose();
            indexBoard();
        } catch (error) {
            Error(error);
        }
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <FormItem>
                        <Input
                            type="text"
                            label="Título*"
                            value={data.title || ""}
                            onChange={(event) =>
                                setData({ ...data, title: event.target.value })
                            }
                        />
                    </FormItem>
                    <FormItem>
                        <Input
                            type="date"
                            label="Início*"
                            value={data.createdAt}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    createdAt: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                    <FormItem>
                        <Input
                            type="date"
                            label="Vencimento"
                            value={data.dueDate}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    dueDate: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                </Row>
                <FormItem>
                    <TextArea
                        label="Descrição"
                        value={data.description || ""}
                        onChange={(event) =>
                            setData({
                                ...data,
                                description: event.target.value,
                            })
                        }
                    />
                </FormItem>
                <FormItem>
                    <SelectContributors
                        {...{ users }}
                        onChange={(values) => {
                            setSelectedUsers(values);
                        }}
                        value={selectedUsers}
                    />
                </FormItem>

                <Row>
                    <MoneyIn
                        show={
                            (data.wallet &&
                                Object.keys(data.wallet).length !== 0) ||
                            System.isAdmin()
                        }
                        md="4"
                    >
                        <Input
                            label="Contribuição financeira"
                            type="text"
                            name="money-contribution"
                            readOnly={!System.isAdmin()}
                        />
                    </MoneyIn>
                    <FormItem className="d-flex justify-content-end">
                        <Switch
                            label="Criar evento"
                            value={createEvent}
                            onChange={(value) => {
                                setCreateEvent(value);
                            }}
                        />
                    </FormItem>
                </Row>

                <Row>
                    <FormItem>
                        <SelectAssets
                            value={selectedAssets}
                            onChange={setSelectedAssets}
                        />
                    </FormItem>
                </Row>

                {data.created_at && (
                    <span className="created-by">
                        Criado em{" "}
                        {new Date(data.created_at).toLocaleDateString()}
                    </span>
                )}

                <GridButtons>
                    {!id ? (
                        <Button type="submit">
                            <FaPaperPlane /> Confirmar
                        </Button>
                    ) : (
                        <>
                            {(data.creator === me.id ||
                                (me.role && me.role.id >= 3)) && (
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
                            <Row>
                                {data.status > 1 && (
                                    <StatusButton
                                        variant="primary"
                                        onClick={handlePrevious}
                                    >
                                        <FaAngleLeft />
                                    </StatusButton>
                                )}
                                {data.status < 3 && (
                                    <StatusButton
                                        variant="success"
                                        onClick={handleNext}
                                    >
                                        <FaAngleRight />
                                    </StatusButton>
                                )}
                            </Row>
                        </>
                    )}
                </GridButtons>
            </Form>
        </Container>
    );
};

export default Index;
