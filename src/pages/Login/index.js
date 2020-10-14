import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import { FaSignInAlt } from "react-icons/fa";
import { Col } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";

import Passista from "../../assets/images/Passista.png";
import LogoImg from "../../assets/images/adsamba-logo.png";

import Form, { GridButtons } from "../../components/Form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Hr from "../../components/Hr";
import Img from "../../components/Img";

import Notification, { Error } from "../../modules/notifications";
import Api from "../../services/api";

const Background = Styled.div`
    min-width: 100vw;
    min-height: 100vh;
    background-image: url(${Passista});
    background-repeat: no-repeat;
    background-size: cover;
`;

const Container = Styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 400px;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    padding: 0 3rem;

    @media (max-width: 750px) {
        width: 100%;
    }
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

const StyledForm = Styled(Form)`
    & a {
        color: var(--purple-1);
        filter: brightness(110%);
    }
`;

const Index = () => {
    const history = useHistory();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        localStorage.clear();
    }, []);

    async function handleSubmit(event) {
        try {
            event.preventDefault();

            if (!identifier || !password) {
                return Notification(
                    "warning",
                    "Nome de usuário e senha são obrigatórios"
                );
            }

            const response = await Api.post(
                "/auth/local",
                { identifier, password },
                { headers: { Authorization: "" } }
            );

            localStorage.setItem("token", `Bearer ${response.data.jwt}`);
            Api.defaults.headers.Authorization = `Bearer ${response.data.jwt}`;

            history.push("/");
        } catch (error) {
            return Error(error);
        }
    }

    return (
        <Background>
            <Container>
                <Header>
                    <h1>
                        <Img src={LogoImg} width="200px"/>
                    </h1>
                </Header>
                <StyledForm
                    min-width="300px"
                    sm-min-width="260px"
                    onSubmit={handleSubmit}
                >
                    <Input
                        type="text"
                        placeholder="Nome de usuário ou e-mail"
                        value={identifier}
                        onChange={(event) => setIdentifier(event.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="Entre com sua senha"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Link to="/forgot-password">Esqueci minha senha</Link>
                    <Col>
                        <GridButtons className="flex-column">
                            <Button type="submit">
                                <FaSignInAlt />
                                Entrar
                            </Button>
                        </GridButtons>
                        <Hr />
                        <GridButtons className="flex-column">
                            <Button
                                background="var(--green-1)"
                                onClick={() => {
                                    history.push("/register");
                                }}
                            >
                                Criar nova conta
                            </Button>
                        </GridButtons>
                    </Col>
                </StyledForm>
            </Container>
        </Background>
    );
};

export default Index;
