import React, { useState, useEffect, useCallback } from "react";
import Styled from "styled-components";
import { FaEdit, FaTrash, FaPaperPlane, FaTimes } from "react-icons/fa";
import { Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import Form, {
    Input,
    GridButtons,
    TextArea,
    ReactSelect,
} from "../../components/Form";
import Button from "../../components/Button";
import Label from "../../components/Label";

import Api from "../../services/api";
import Notification, { Error } from "../../modules/notifications";
import Confirm from "../../modules/alertConfirm";

const Container = Styled.div`
    display: flex;
    justify-content: center;
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

const Index = ({ board, me, onClose, index }) => {
    const history = useHistory();

    const [data, setData] = useState({ users: [] });

    const [users, setUsers] = useState([]);

    const [meData, setMeData] = useState({});

    useEffect(() => {
        if (meData !== me) {
            setMeData(me);
        }
    }, [me, meData]);

    useEffect(() => {
        if (!(Object.keys(board).length === 0)) {
            const usersContributing = board.users.map((user) => ({
                value: user.id,
                label: user.username,
            }));

            setData({
                ...board,
                users: usersContributing,
                creator: board.creator.id,
            });
        } else {
            setData(board);
        }
    }, [board]);

    useEffect(() => {
        async function indexUsers() {
            try {
                const response = await Api.get(`/users?_limit=-1`);

                const serializedUsers = response.data.map((user) => ({
                    value: user.id,
                    label: user.username,
                }));

                if (Array.isArray(data.users)) {
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
    }, [data.users, me, meData]);

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
            await Api.post("/boards", { ...data, creator: me.id });

            onClose();
            Notification("success", "Quadro cadastrado");
            index();
        } catch (error) {
            Error(error);
        }
    }

    async function update(data) {
        try {
            await Api.put(`/boards/${data.id}`, data);

            Notification("success", "Quadro atualizado");
            index();
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
                    await Api.delete(`/boards/${data.id}`);
                    Notification("success", "Quadro removido");
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
        if (Array.isArray(data.users)) {
            const users = data.users.map((user) => user.value);

            requestData = { ...data, users };
        } else {
            requestData = { ...data, users: [] };
        }

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
                    value={data.title || ""}
                />
                <TextArea
                    label="Descrição"
                    onChange={(event) =>
                        setData({ ...data, description: event.target.value })
                    }
                    maxLength={280}
                    value={data.description || ""}
                />
                {me.role >= 3 && (
                    <Label>
                        Contribuidores
                        <Row>
                            {Array.isArray(data.users) && (
                                <>
                                    {data.users.map((user) => (
                                        <>
                                            {me.id !== user.value && (
                                                <Contributor key={user.value}>
                                                    <span>{user.label}</span>
                                                    <div
                                                        onClick={() => {
                                                            handleRemoveContributor(
                                                                user
                                                            );
                                                        }}
                                                    >
                                                        <FaTimes />
                                                    </div>
                                                </Contributor>
                                            )}
                                        </>
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
                )}
                <GridButtons>
                    {Object.keys(board).length === 0 ? (
                        <Button type="submit">
                            <FaPaperPlane />
                            Confirmar
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
                        </>
                    )}
                </GridButtons>
            </Form>
        </Container>
    );
};

export default Index;
