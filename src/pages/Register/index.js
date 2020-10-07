import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Styled from "styled-components";
import { Row } from "react-bootstrap";

import Button from "../../components/Button";
import Form, { Input } from "../../components/Form";
import { File } from "../../components/Input";

import Notification, { Error } from "../../modules/notifications";

import Api, { requestPublic } from "../../services/api";

const Container = Styled.div`
    width: 100%;
    min-height: 100vh;
    max-width: 320px;
    
    margin: 0 auto;
    padding: 1rem;

    display: flex;
    flex-direction: column;
`;

const Header = Styled.header.attrs({
    className: "row",
})`
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;

    & h1 {
        color: var(--gray-2);
        font-size: 2.5rem;
    }
`;

const ButtonsGrid = Styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

const Index = () => {
    const history = useHistory();

    const [data, setData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: {},
    });

    function handleValidate() {
        if (!data.username) {
            return { status: false, message: "Nome é obrigatório" };
        }

        if (!data.email) {
            return { status: false, message: "E-mail é obrigatório" };
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
            return { status: false, message: "E-mail inválido!" };
        }

        if (!data.password) {
            return { status: false, message: "Senha é obrigatório" };
        }

        if (!data.confirmPassword) {
            return {
                status: false,
                message: "Confirmação de senha é obrigatório",
            };
        }

        if (data.password !== data.confirmPassword) {
            return { status: false, message: "Confirmação de senha inválida" };
        }

        return { status: true };
    }

    async function uploadFile(file) {
        let data = new FormData();
        data.append(`files`, file);
        const response = await Api.post("/upload", data, requestPublic);
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
                if (!(Object.keys(data.image.file).length === 0)) {
                    const image = await uploadFile(data.image.file);
                    data.image = image;
                } else {
                    data.image = {};
                }
            } catch (error) {
                data.image = {};
            }

            const response = await Api.post(
                "/auth/local/register",
                data,
                requestPublic
            );

            localStorage.setItem("token", `Bearer ${response.data.jwt}`);
            Api.defaults.headers.Authorization = `Bearer ${response.data.jwt}`;

            history.push("/");
        } catch (error) {
            Error(error);
        }
    }

    return (
        <Container>
            <Header>
                <h1>Cadastrar Usuário</h1>
            </Header>
            <Form onSubmit={handleSubmit}>
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
                            setData({
                                ...data,
                                image: {},
                            });
                        }}
                    />
                </Row>
                <Input
                    label="Nome de usuário*"
                    type="text"
                    placeholder="Entre com o seu nome"
                    value={data.username}
                    onChange={(event) =>
                        setData({ ...data, username: event.target.value })
                    }
                    maxLength={30}
                />
                <Input
                    label="E-mail*"
                    type="email"
                    placeholder="Entre com o seu e-mail"
                    value={data.email}
                    onChange={(event) =>
                        setData({ ...data, email: event.target.value })
                    }
                    maxLength={30}
                />
                <Input
                    label="Senha*"
                    type="password"
                    placeholder="Entre com uma senha"
                    value={data.password}
                    onChange={(event) =>
                        setData({ ...data, password: event.target.value })
                    }
                    maxLength={30}
                />
                <Input
                    label="Confirmar senha*"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={data.confirmPassword}
                    onChange={(event) =>
                        setData({
                            ...data,
                            confirmPassword: event.target.value,
                        })
                    }
                    maxLength={30}
                />
                <ButtonsGrid>
                    <Button type="submit">Confirmar</Button>
                </ButtonsGrid>
            </Form>
        </Container>
    );
};

export default Index;
