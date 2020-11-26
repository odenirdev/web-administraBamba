import React, { useEffect, useState, useCallback, useContext } from "react";
import Styled from "styled-components";
import { Row } from "react-bootstrap";
import { Switch } from "react-og-forms";

import Form, {
    Input,
    GridButtons,
    TextArea,
    FormItem,
    ReactSelect,
} from "../../components/Form";
import Button from "../../components/Button";
import Label from "../../components/Label";
import {
    FaEdit,
    FaTrash,
    FaPaperPlane,
    FaTimes,
    FaAngleLeft,
    FaAngleRight,
} from "react-icons/fa";

import Api from "../../services/api";
import Notification, { Error } from "../../modules/notifications";

import AuthContext from "../../components/AuthContext";
import BoardContext from "../../components/Board/context";

const Container = Styled.div`
    display: flex;
    justify-content: center;
`;

const StatusButton = Styled(Button)`
    padding: 15px;
    border-radius: 30px;

    & svg {
        margin: 0;
    }
`;

const Contributor = Styled.div`
    background-color: var(--gray-5);
    width: fit-content;
    margin: 10px 10px;
    border-radius: 2px;
    display: flex;

    & span {
        margin: 5px 10px;
    }

    & div {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        & svg {
            margin: 0 10px;
        }

        &:hover {
            background-color: var(--red-1);
            color: var(--gray-5);
        }
    }
`;

const Index = ({ task, index, onClose }) => {
    const [data, setData] = useState({});

    const [users, setUsers] = useState([]);

    const [board, setBoard] = useState({});

    const {
        auth: { me },
    } = useContext(AuthContext);
    const {
        data: { lists, id: idBoard },
        index: indexBoard,
    } = useContext(BoardContext);

    useEffect(() => {
        if (!(Object.keys(task).length === 0)) {
            let usersContributing = [];
            if (Array.isArray(task.users)) {
                usersContributing = task.users.map((user) => ({
                    value: user.id,
                    label: user.username,
                }));
            }

            try {
                setData({
                    ...task,
                    users: usersContributing,
                    creator: task.creator.id,
                });
            } catch (error) {
                setData({ ...task, users: usersContributing });
            }
        } else {
            setData({});
        }
    }, [task]);

    useEffect(() => {
        async function showBoard() {
            if (typeof task.board === "object") {
                const response = await Api.get(`/boards/${task.board.id}`);

                setBoard(response.data);
            } else if (idBoard) {
                const response = await Api.get(`/boards/${idBoard}`);

                setBoard(response.data);
            }
        }

        showBoard();
    }, [idBoard, task]);

    useEffect(() => {
        if (Array.isArray(board.users)) {
            let contributorsUsers = board.users.map((user) => ({
                value: user.id,
                label: user.username,
            }));

            contributorsUsers = [
                ...contributorsUsers,
                { value: board.creator.id, label: board.creator.username },
            ];

            if (Array.isArray(task.users)) {
                const usersTask = task.users.map((user) => user.id);

                const filteredUsers = contributorsUsers.filter(
                    (user) => !usersTask.includes(user.value)
                );

                setUsers(filteredUsers);
            } else {
                setUsers(contributorsUsers);
            }
        }
    }, [board, task]);

    const handleSelectContributing = useCallback(
        (user) => {
            const filteredUsers = users.filter(
                (filterUser) => filterUser.value !== user.value
            );

            setUsers(filteredUsers);

            if (Array.isArray(data.users)) {
                setData({ ...data, users: [...data.users, user] });
            } else {
                setData({ ...data, users: [user] });
            }
        },
        [data, users]
    );

    function handleRemoveContributor(user) {
        const newUsers = [...users, user];

        setUsers(newUsers);

        const filteredContributors = data.users.filter(
            (filteredUser) => filteredUser.value !== user.value
        );

        setData({ ...data, users: filteredContributors });
    }

    async function create(data) {
        try {
            const createData = {
                ...data,
                board: idBoard,
                creator: me.id,
                list: 1,
                position: lists[1].tasks.length,
            };

            const response = await Api.post("/tasks", createData);

            try {
                await Api.post("/logs", {
                    entity: 2,
                    type: 0,
                    data: createData,
                    createdAt: new Date(),
                    user: me.id,
                });
            } catch (error) {
                await Api.delete(`/tasks/${response.id}`);

                return Error(error);
            }

            indexBoard();
            onClose();
            Notification("success", "Tarefa cadastrada");
        } catch (error) {
            Error(error);
        }
    }

    async function update(data) {
        try {
            await Api.put(`/tasks/${data.id}`, data);

            try {
                await Api.post("/logs", {
                    entity: 2,
                    type: 1,
                    data: data,
                    createdAt: new Date(),
                    user: me.id,
                });
            } catch (error) {
                await Api.put(`/tasks/${data.id}`, task);

                return Error(error);
            }

            indexBoard();
            onClose();
            Notification("success", "Tarefa atualizada");
        } catch (error) {
            Error(error);
        }
    }

    async function destroy() {
        try {
            await Api.delete(`/tasks/${data.id}`);

            try {
                await Api.post("/logs", {
                    entity: 2,
                    type: 2,
                    data: data,
                    createdAt: new Date(),
                    user: me.id,
                });
            } catch (error) {
                await Api.post(`/tasks`, data);

                return Error(error);
            }

            indexBoard();
            onClose();
            Notification("success", "Tarefa removido");
        } catch (error) {
            Error(error);
        }
    }

    function addDays(date, days) {
        let result = new Date(new Date(date).setHours(1));
        result = new Date(
            result.setDate(result.getDate() + days)
        ).toISOString();
        return result;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!data.title) {
            return Notification("warning", "Título é obrigatório");
        }

        let requestData;
        if (Array.isArray(data.users)) {
            const users = data.users.map((user) => user.value);

            requestData = { ...data, users };
        } else {
            requestData = { ...data, users: [] };
        }

        if (!requestData.dueDate || requestData.dueDate === "false") {
            delete requestData.dueDate;
        } else {
            requestData.dueDate = addDays(requestData.dueDate, 1);
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
                <Row>
                    <FormItem>
                        <Input
                            type="datetime-local"
                            label="Início"
                            value={data.createdAt ? data.createdAt : ""}
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
                            type="datetime-local"
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
                    <Switch
                        label="Dia todo"
                        onChange={(event) => {
                            setData({
                                ...data,
                                isAllDay: event,
                            });
                        }}
                        value={data.isAllDay || false}
                    />
                </FormItem>
                <Label>
                    Contribuidores
                    <Row>
                        {Array.isArray(data.users) && (
                            <>
                                {data.users.map((user) => (
                                    <Contributor key={user.value}>
                                        <span>{user.label}</span>
                                        <div
                                            onClick={() => {
                                                handleRemoveContributor(user);
                                            }}
                                        >
                                            <FaTimes />
                                        </div>
                                    </Contributor>
                                ))}
                            </>
                        )}
                    </Row>
                    <ReactSelect
                        options={users}
                        onChange={(event) => {
                            handleSelectContributing(event);
                        }}
                    />
                </Label>
                {data.created_at && (
                    <span>
                        Criado em{" "}
                        {new Date(data.created_at).toLocaleDateString()}
                    </span>
                )}
                <GridButtons>
                    {Object.keys(task).length === 0 ? (
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
