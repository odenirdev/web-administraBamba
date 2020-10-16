import React, { useEffect, useState, useCallback } from "react";
import Styled from "styled-components";
import { Row } from "react-bootstrap";

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

const Index = ({ id, index, onClose, idBoard }) => {
    const [data, setData] = useState({});

    const [users, setUsers] = useState([]);

    const [task, setTask] = useState({});

    const [board, setBoard] = useState({});

    const [me, setMe] = useState({});

    useEffect(() => {
        async function showMe() {
            try {
                const response = await Api.get("/users/me");

                try {
                    setMe({ ...response.data, role: response.data.role.id });
                } catch (err) {}
            } catch (error) {
                Error(error);
            }
        }

        showMe();
    }, []);

    useEffect(() => {
        async function show() {
            try {
                if (id) {
                    const response = await Api.get(`/tasks/${id}`);

                    setTask(response.data);
                } else {
                    setTask({});
                }
            } catch (error) {
                Error(error);
            }
        }

        show();
    }, [id]);

    useEffect(() => {
        if (!(Object.keys(task).length === 0)) {
            const usersContributing = task.users.map((user) => ({
                value: user.id,
                label: user.username,
            }));

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
            await Api.post("/tasks", {
                ...data,
                board: board.id,
                creator: me.id,
            });

            index();
            onClose();
            Notification("success", "Tarefa cadastrada");
        } catch (error) {
            Error(error);
        }
    }

    async function update(data) {
        try {
            await Api.put(`/tasks/${data.id}`, data);

            index();
            Notification("success", "Tarefa atualizada");
        } catch (error) {
            Error(error);
        }
    }

    async function destroy() {
        try {
            await Api.delete(`/tasks/${data.id}`);

            index();
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
            index();
        } catch (error) {
            Error(error);
        }
    }

    async function handlePrevious() {
        try {
            await Api.put(`/tasks/${data.id}`, { status: data.status - 1 });

            onClose();
            index();
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
                            label="Vencimento"
                            value={data.dueDate || ""}
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
                            {(data.creator === me.id || me.role >= 3) && (
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
