import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Styled from "styled-components";
import { Row } from "react-bootstrap";

import Button from "../../components/Button";
import Form, { Input } from "../../components/Form";
import { File } from "../../components/Input";

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
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    return (
        <Container>
            <Header>
                <h1>Cadastrar Usuário</h1>
            </Header>
            <Form>
                <Row className="d-flex justify-content-center">
                    <File width="120px" height="120px" />
                </Row>
                <Input
                    label="Nome"
                    type="text"
                    placeholder="Entre com o seu nome"
                    value={data.name}
                    onChange={(event) =>
                        setData({ ...data, name: event.target.value })
                    }
                    maxLength={30}
                />
                <Input
                    label="E-mail"
                    type="email"
                    placeholder="Entre com o seu e-mail"
                    value={data.email}
                    onChange={(event) =>
                        setData({ ...data, email: event.target.value })
                    }
                    maxLength={30}
                />
                <Input
                    label="Senha"
                    type="password"
                    placeholder="Entre com uma senha"
                    value={data.password}
                    onChange={(event) =>
                        setData({ ...data, password: event.target.value })
                    }
                    maxLength={30}
                />
                <Input
                    label="Confirmar senha"
                    type="text"
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
                    <Button
                        onClick={() => {
                            history.push("/register-school");
                        }}
                    >
                        Confirmar
                    </Button>
                </ButtonsGrid>
            </Form>
        </Container>
    );
};

export default Index;
