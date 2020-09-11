import React from "react";
import Styled from "styled-components";
import { FaSignInAlt } from "react-icons/fa";
import { Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import Passista from "../../assets/images/Passista.png";
import LogoImg from "../../assets/images/Logo.png";

import Form, { GridButtons } from "../../components/Form";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Hr from "../../components/Hr";

const Background = Styled.div`
    min-width: 100vw;
    min-height: 100vh;
    background-image: url(${Passista});
    background-repeat: no-repeat;
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

    @media (max-width: 750px) {
        width: 100%;
    }
`;

const Header = Styled.header`
    margin-bottom: 0.5rem;

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

const Index = () => {
    const history = useHistory();

    return (
        <Background>
            <Container>
                <Header>
                    <h1>
                        <Logo src={LogoImg} />
                        <span>AdministraBamba</span>
                    </h1>
                </Header>
                <Form min-width="300px" sm-min-width="260px">
                    <Input placeholder="Nome de usuário ou e-mail" />
                    <Input placeholder="Entre com sua senha" />
                    <Col>
                        <GridButtons className="flex-column">
                            <Button>
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
                </Form>
            </Container>
        </Background>
    );
};

export default Index;
