import React, { useState, useEffect, useContext } from "react";
import Styled from "styled-components";
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";

import Form, { Input, GridButtons, Select } from "../../components/Form";
import { File } from "../../components/Input";
import Button from "../../components/Button";
import Img from "../../components/Img";
import AuthContext from "../../components/AuthContext";

import Api from "../../services/api";
import Notification, { Error } from "../../modules/notifications";
import Confirm from "../../modules/alertConfirm";

import EmptyImage from "../../assets/images/empty.jpg";

const Container = Styled.div`
    display: flex;
    justify-content: center;
`;

const Index = ({ user, updateUsers, onClose }) => {
    const [data, setData] = useState({ image: {} });

    const { me } = useContext(AuthContext);

    useEffect(() => {
        try {
            if (!(Object.keys(user.image).length === 0)) {
                setData({
                    ...user,
                    image: {
                        ...user.image,
                        preview: Api.defaults.baseURL + user.image.url,
                    },
                    role: user.role.id,
                });
            } else {
                setData({ ...user, role: user.role.id });
            }
        } catch (error) {
            setData({ image: {}, role: "" });
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

        if (!data.role) {
            return { status: false, message: "Nível de Acesso é obrigatório" };
        }

        return { status: true };
    }

    async function create(data) {
        try {
            const response = await Api.post(`/users/`, data);

            try {
                await Api.post("/logs", {
                    entity: 0,
                    type: 0,
                    data,
                    createdAt: new Date(),
                    user: me.id,
                });
            } catch (error) {
                await Api.delete(`/users/${response.id}`);

                return Error(error);
            }

            Notification("success", "Usuário cadastrado");
            updateUsers();
            onClose();
        } catch (error) {
            return Error(error);
        }
    }

    async function update(data) {
        try {
            await Api.put(`/users/${data.id}`, data);

            try {
                await Api.post("/logs", {
                    entity: 0,
                    type: 1,
                    data,
                    createdAt: new Date(),
                    user: me.id,
                });
            } catch (error) {
                await Api.put(`/users/${data.id}`, user);

                return Error(error);
            }

            Notification("success", "Usuário atualizado");
            updateUsers();
        } catch (error) {
            return Error(error);
        }
    }

    function destroy() {
        Confirm(
            "Remover Usuário",
            "Essa operação não pode ser desfeita, tem certeza ?",
            async () => {
                try {
                    await Api.delete(`/users/${data.id}`);

                    try {
                        await Api.post("/logs", {
                            entity: 0,
                            type: 2,
                            data,
                            createdAt: new Date(),
                            user: me.id,
                        });
                    } catch (error) {
                        await Api.post(`/users/`, data);

                        return Error(error);
                    }

                    Notification("success", "Usuário removido");
                    updateUsers();
                    onClose();
                } catch (error) {
                    return Error(error);
                }
            }
        );
    }

    async function uploadFile(file) {
        let data = new FormData();
        data.append(`files`, file);
        const response = await Api.post("/upload", data);
        return response.data[0];
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const validate = handleValidate();
        if (!validate.status) {
            return Notification("warning", validate.message);
        }

        let resquestData = data;

        if (
            !resquestData.image.id &&
            !(Object.keys(resquestData.image).length === 0)
        ) {
            const response = await uploadFile(resquestData.image.file);

            resquestData.image = response;
        }

        if (data.id) {
            return update(resquestData);
        }

        resquestData.password = "adsamba";

        return create(resquestData);
    }

    function isAdmin() {
        return me.role && me.role.id === 4;
    }

    return (
        <Container>
            <Form max-width="70%" sm-max-width="100%" onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mb-3">
                    {isAdmin() ? (
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
                    ) : (
                        <Img
                            width="120px"
                            height="120px"
                            src={
                                !(Object.keys(data.image).length === 0)
                                    ? Api.defaults.baseURL + data.image.url
                                    : EmptyImage
                            }
                        />
                    )}
                </div>
                <Input
                    label="Nome de usuário*"
                    onChange={(event) => {
                        setData({ ...data, username: event.target.value });
                    }}
                    maxLength={30}
                    value={data.username || ""}
                    readOnly={!isAdmin}
                />
                <Input
                    label="E-Mail*"
                    onChange={(event) => {
                        setData({ ...data, email: event.target.value });
                    }}
                    maxLength={30}
                    value={data.email || ""}
                    readOnly={!isAdmin()}
                />
                <Select
                    label="Nível de Acesso*"
                    value={data.role}
                    onChange={(event) => {
                        setData({
                            ...data,
                            role: parseInt(event.target.value),
                        });
                    }}
                    disabled={!isAdmin()}
                >
                    <option value="">Selecione...</option>
                    <option value="4">Administrador</option>
                    <option value="3">Diretoria</option>
                    <option value="1">Componente</option>
                </Select>
                {isAdmin() && (
                    <GridButtons>
                        {Object.keys(user).length === 0 ? (
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
                    </GridButtons>
                )}
            </Form>
        </Container>
    );
};

export default Index;
