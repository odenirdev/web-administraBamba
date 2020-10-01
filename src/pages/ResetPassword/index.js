import React, { useState } from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import Passista from "../../assets/images/Passista.png";
import LogoImg from "../../assets/images/Logo.png";

import Form, { GridButtons } from "../../components/Form";
import Button from "../../components/Button";
import Input from "../../components/Input";

import Notification, { Error } from "../../modules/notifications";
import Api, { requestPublic } from "../../services/api";

const Background = Styled.div`
    min-width: 100vw;
    min-height: 100vh;
    background-image: url(${Passista});
    background-repeat: no-repeat;
    background-size: cover;
`;

const Header = Styled.header`
    width: 100%;

    & h1 {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--gray-5);
    }

    & img {
        margin-right: 14px;
    }
`;

const Logo = Styled.img`
    width: 64px;
    height: 64px;
`;

const Container = Styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 400px;
    height: 100vh;
    background-color: var(--gray-3);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    padding: 0 1rem;

    @media (max-width: 750px) {
        width: 100%;
    }
`;

const Index = () => {
    const history = useHistory();

    const [data, setData] = useState({});

    function handleValidation() {
        if (!data.code) {
            return { status: false, message: "Token é obrigatório" };
        }

        if (!data.password) {
            return { status: false, message: "Senha é obrigatório" };
        }

        if (!data.passwordConfirmation) {
            return {
                status: false,
                message: "Confirmação de senha é obrigatório",
            };
        }

        if (data.password !== data.passwordConfirmation) {
            return {
                status: false,
                message: "Confirmação de senha é inválida",
            };
        }

        return { status: true };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const validate = handleValidation();
            if (!validate.status) {
                return Notification("warning", validate.message);
            }

            await Api.post("/auth/reset-password", data, requestPublic);

            Notification("success", "Senha alterada");
            history.push("/auth");
        } catch (error) {
            Error(error);
        }
    }

    return (
        <Background>
            <Container>
                <Header>
                    <h1>
                        <Logo src={LogoImg} />
                        <span>AdministraBamba</span>
                    </h1>
                </Header>
                <Form
                    min-width="300px"
                    sm-min-width="260px"
                    onSubmit={handleSubmit}
                >
                    <Input
                        type="text"
                        placeholder="Entre com o token"
                        value={data.code}
                        onChange={(event) => {
                            setData({ ...data, code: event.target.value });
                        }}
                    />
                    <Input
                        type="password"
                        placeholder="Entre com a senha"
                        value={data.password}
                        onChange={(event) => {
                            setData({ ...data, password: event.target.value });
                        }}
                    />
                    <Input
                        type="password"
                        placeholder="Entre com a confirmação de senha"
                        value={data.passwordConfirmation}
                        onChange={(event) => {
                            setData({
                                ...data,
                                passwordConfirmation: event.target.value,
                            });
                        }}
                    />
                    <Col>
                        <GridButtons className="flex-column">
                            <Button type="submit">
                                <FaEdit />
                                Confirmar
                            </Button>
                        </GridButtons>
                    </Col>
                </Form>
            </Container>
        </Background>
    );
};

export default Index;
