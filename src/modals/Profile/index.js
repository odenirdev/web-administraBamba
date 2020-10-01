import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import Form, { Input, GridButtons } from "../../components/Form";
import Button from "../../components/Button";
import { File } from "../../components/Input";

import Api from "../../services/api";
import Confirm from "../../modules/alertConfirm";
import Notification, { Error } from "../../modules/notifications";

const Container = Styled.div`
    display: flex;
    justify-content: center;
`;

const Index = ({ user }) => {
    const [data, setData] = useState({});

    const history = useHistory();

    useEffect(() => {
        try {
            if (!(Object.keys(user.image).length === 0)) {
                setData({
                    ...user,
                    image: {
                        ...user.image,
                        preview: Api.defaults.baseURL + user.image.url,
                    },
                });
            } else {
                setData(user);
            }
        } catch (error) {
            delete user.image;
            setData(user);
        }
    }, [user]);

    function handleValidate() {
        if (!data.username) {
            return { status: false, message: "Nome de usuário é obrigatório" };
        }

        if (!data.email) {
            return { status: false, message: "E-mail é obrigatório" };
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
            return { status: false, message: "E-mail inválido!" };
        }

        if (data.password) {
            if (!data.confirmPassword) {
                return {
                    status: false,
                    message: "Confirmação de senha é obrigatório",
                };
            }

            if (data.password !== data.confirmPassword) {
                return {
                    status: false,
                    message: "Confirmação de senha inválida",
                };
            }
        }

        return { status: true };
    }

    async function uploadFile(file) {
        let data = new FormData();
        data.append(`files`, file);
        const response = await Api.post("/upload", data);
        return response.data[0];
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const validate = handleValidate();
            if (!validate.status) {
                return Notification("warning", validate.message);
            }

            try {
                if (
                    !data.image.id &&
                    !(Object.keys(data.image.file).length === 0)
                ) {
                    const image = await uploadFile(data.image.file);
                    data.image = image;
                }
            } catch (error) {
                data.image = {};
            }

            await Api.put(`/users/${user.id}`, data);

            Notification("success", "Conta atualizada");
        } catch (error) {
            Error(error);
        }
    }

    function handleDelete(e) {
        e.preventDefault();

        Confirm(
            "Remover conta",
            "Essa operação não pode ser desfeita, tem certeza ?",
            async () => {
                try {
                    if (data.image.id) {
                        await Api.delete(`/upload/files/${data.image.id}`);
                    }

                    await Api.delete(`/users/${data.id}`);

                    history.push("/auth");
                } catch (error) {
                    Error(error);
                }
            }
        );
    }

    return (
        <Container>
            <Form max-width="70%" sm-max-width="100%" onSubmit={handleSubmit}>
                <Row className="d-flex justify-content-center">
                    <File
                        width={120}
                        height={120}
                        file={data.image}
                        onUpload={(files) => {
                            const file = files[0];

                            setData({
                                ...data,
                                image: {
                                    file,
                                    preview: URL.createObjectURL(file),
                                },
                            });
                        }}
                        onDeleteFile={() => {
                            Confirm(
                                "Remover Imagem",
                                "Essa operação não pode ser desfeita, tem certeza ?",
                                async () => {
                                    if (data.image.id) {
                                        await Api.delete(
                                            `/upload/files/${data.image.id}`
                                        );

                                        await Api.put(`/user/${data.id}`, {
                                            image: {},
                                        });
                                    }

                                    setData({
                                        ...data,
                                        image: {},
                                    });
                                }
                            );
                        }}
                    />
                </Row>
                <Input
                    label="Nome de usuário*"
                    onChange={(event) =>
                        setData({ ...data, username: event.target.value })
                    }
                    maxLength={30}
                    value={data.username || ""}
                />
                <Input
                    label="E-Mail*"
                    onChange={(event) =>
                        setData({ ...data, email: event.target.value })
                    }
                    maxLength={30}
                    value={data.email || ""}
                />
                <Input
                    label="Senha*"
                    onChange={(event) =>
                        setData({ ...data, password: event.target.value })
                    }
                    maxLength={30}
                    value={data.password || ""}
                    type="password"
                />
                <Input
                    label="Confirmar senha*"
                    onChange={(event) =>
                        setData({
                            ...data,
                            confirmPassword: event.target.value,
                        })
                    }
                    maxLength={30}
                    value={data.confirmPassword || ""}
                    type="password"
                />
                <GridButtons>
                    <Button
                        color="var(--red-1)"
                        variant="secundary"
                        onClick={handleDelete}
                    >
                        <FaTrash />
                        Remover
                    </Button>
                    <Button type="submit">
                        <FaEdit />
                        Editar
                    </Button>
                </GridButtons>
            </Form>
        </Container>
    );
};

export default Index;
