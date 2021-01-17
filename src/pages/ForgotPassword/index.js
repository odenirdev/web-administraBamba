import React, { useState } from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import Passista from "../../assets/images/Passista.png";
import LogoImg from "../../assets/images/adsamba-logo.png";

import Form, { GridButtons } from "../../components/Form";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Img from "../../components/Img";

import Notification, { Error } from "../../modules/notifications";
import Api, { requestPublic } from "../../services/api";

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

    const [email, setEmail] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (!email) {
                return Notification("warning", "E-mail é obrigatório");
            }

            await Api.post("/auth/forgot-password", { email }, requestPublic);

            Notification("success", "Token enviado");
            history.push("/reset-password");
        } catch (error) {
            Error(error);
        }
    }

    return (
        <Background>
            <Container>
                <Header>
                    <h1>
                        <Img src={LogoImg} width="200px" />
                    </h1>
                </Header>
                <StyledForm
                    min-width="300px"
                    sm-min-width="260px"
                    onSubmit={handleSubmit}
                >
                    <Input
                        label="E-mail"
                        type="text"
                        placeholder="Entre com seu e-mail"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <Col>
                        <GridButtons className="flex-column">
                            <Button type="submit">
                                <FaPaperPlane />
                                Enviar
                            </Button>
                        </GridButtons>
                    </Col>
                </StyledForm>
            </Container>
        </Background>
    );
};

export default Index;
