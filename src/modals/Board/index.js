import React, { useState, useEffect, useContext } from "react";
import Styled from "styled-components";
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import Form, { Input, GridButtons, TextArea } from "../../components/Form";
import Button from "../../components/Button";
import SelectContributors from "../../components/SelectContributors";

import AuthContext from "../../components/AuthContext";
import BoardContext from "../../components/Board/context";

import Api from "../../services/api";
import Firebase from "../../services/firebase";

import Notification, { Error } from "../../modules/notifications";
import Confirm from "../../modules/alertConfirm";

const Container = Styled.div`
    display: flex;
    justify-content: center;
`;

const Index = ({ onClose, index: indexBoards }) => {
    const history = useHistory();

    const initialData = {
        title: "",
        description: "",
        users: [],
    };

    const [data, setData] = useState(initialData);

    const [users, setUsers] = useState([]);

    const [selectedUsers, setSelectedUsers] = useState([]);

    const { data: board, index } = useContext(BoardContext);

    const {
        auth: { me },
    } = useContext(AuthContext);

    useEffect(() => {
        if (board) {
            if (Array.isArray(board.users)) {
                const usersContributing = board.users.map((user) => ({
                    value: user.id,
                    username: user.username,
                    email: user.email,
                    image: user.image.url,
                }));

                setSelectedUsers(usersContributing);

                setData({
                    ...board,
                    creator: board.creator.id,
                });
            }
        }
    }, [board]);

    useEffect(() => {
        async function indexUsers() {
            try {
                const response = await Api.get(`/users?_limit=-1`);

                const serializedUsers = response.data.map((user) => ({
                    value: user.id,
                    username: user.username,
                    email: user.email,
                    image: user.image.url,
                }));

                if (data && Array.isArray(data.users)) {
                    const contributorsID = data.users.map((user) => user.value);

                    let filteredUsers = serializedUsers.filter((user) => {
                        if (me.id === user.value) {
                            return false;
                        }

                        return !contributorsID.includes(user.value);
                    });

                    setUsers(filteredUsers);
                }
            } catch (error) {
                Error(error);
            }
        }

        indexUsers();
    }, [board, data, me]);

    function handleValidate() {
        if (!data.title) {
            return { status: false, message: "Título é obrigatório" };
        }

        if (!data.description) {
            return { status: false, message: "Descrição é obrigatório" };
        }

        return { status: true };
    }

    async function create(data) {
        try {
            const response = await Api.post("/boards", {
                ...data,
                creator: me.id,
            });

            selectedUsers.forEach((item) => {
                Firebase.child("notifications").push(
                    {
                        title: "Contribuição adicionada",
                        description: `Você está contribuindo para um novo quadro "${data.title}" criado por ${me.username}`,
                        saw: false,
                        to_url: `/board/${response.data.id}`,
                        to: item.value,
                    },
                    (error) => {
                        if (error) {
                            Error(error);
                        }
                    }
                );
            });

            indexBoards();
            setData(initialData);
            setSelectedUsers([]);
            onClose();
            Notification("success", "Quadro cadastrado");
        } catch (error) {
            Error(error);
        }
    }

    function handleUpdateNotifications(data) {
        const newDataUsers = data.users;

        const oldDataUsers = board.users.map((user) => parseInt(user.id));

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
                    description: `Você está contribuindo para um novo quadro "${data.title}"`,
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
                    description: `Você não está mais contribuindo para quadro "${board.title}"`,
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

    async function update(data) {
        try {
            await Api.put(`/boards/${data.id}`, data);

            handleUpdateNotifications(data);
            index();
            setData(initialData);
            onClose();
            setSelectedUsers([]);
            Notification("success", "Quadro atualizado");
        } catch (error) {
            Error(error);
        }
    }

    function destroy() {
        Confirm(
            "Remover Quadro",
            "Essa operação não pode ser desfeita, tem certeza ?",
            async () => {
                try {
                    data.lists.forEach((list) => {
                        list.tasks.map(async (task) => {
                            await Api.put(`/tasks/${task.id}`, {
                                deleted: true,
                            });
                        });
                    });

                    await Api.put(`/boards/${data.id}`, {
                        deleted: true,
                    });

                    selectedUsers.forEach((item) => {
                        Firebase.child("notifications").push(
                            {
                                title: "Contribuição removida",
                                description: `Quadro ${data.title} foi removido por ${me.username}`,
                                saw: false,
                                to_url: "",
                                to: item.value,
                            },
                            (error) => {
                                if (error) {
                                    Error(error);
                                }
                            }
                        );
                    });

                    Notification("success", "Quadro removido");
                    setData(initialData);
                    history.push("/boards");
                } catch (error) {
                    Error(error);
                }
            }
        );
    }

    function handleSubmit(e) {
        e.preventDefault();
        const validate = handleValidate();
        if (!validate.status) {
            return Notification("warning", validate.message);
        }

        let requestData;
        const users = selectedUsers.map((user) => user.value);

        requestData = { ...data, users };

        if (data.id) {
            update(requestData);
            return;
        }

        return create(requestData);
    }

    return (
        <Container>
            <Form max-width="70%" sm-max-width="100%" onSubmit={handleSubmit}>
                <Input
                    label="Título*"
                    onChange={(event) =>
                        setData({ ...data, title: event.target.value })
                    }
                    maxLength={30}
                    value={data.title}
                />
                <TextArea
                    label="Descrição*"
                    onChange={(event) =>
                        setData({ ...data, description: event.target.value })
                    }
                    maxLength={280}
                    value={data.description}
                />
                {me.role && me.role.id >= 3 && (
                    <SelectContributors
                        {...{ users }}
                        onChange={(values) => {
                            setSelectedUsers(values);
                        }}
                        value={selectedUsers}
                    />
                )}
                <GridButtons>
                    {!board ? (
                        <Button type="submit">
                            <FaPaperPlane />
                            Confirmar
                        </Button>
                    ) : (
                        <>
                            {((data && data.creator === me.id) ||
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
                        </>
                    )}
                </GridButtons>
            </Form>
        </Container>
    );
};

export default Index;
