import React, { useState } from "react";
import Styled from "styled-components";
import { Row } from "react-bootstrap";
import { FaPaperPlane } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import Form, {
    Input,
    TextArea,
    FormItem,
    GridButtons,
} from "../../components/Form";
import Button from "../../components/Button";
import { File } from "../../components/Input";

const Container = Styled.div`
    width: 100%;
    min-height: 100vh;
    max-width: 800px;
    
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
        font-size: 2rem;
    }
`;

const Index = () => {
    const history = useHistory();

    const [data, setData] = useState({});

    return (
        <Container>
            <Header>
                <h1>Cadastrar Escola de Samba</h1>
            </Header>
            <Form>
                <FormItem className="d-flex justify-content-center">
                    <File />
                </FormItem>
                <Row>
                    <FormItem md="6" sm="12">
                        <Input
                            label="Nome*"
                            value={data.name || ""}
                            onChange={(event) =>
                                setData({ ...data, name: event.target.value })
                            }
                        />
                    </FormItem>
                    <FormItem md="6" sm="12">
                        <Input
                            label="E-mail*"
                            value={data.email || ""}
                            onChange={(event) =>
                                setData({ ...data, email: event.target.value })
                            }
                        />
                    </FormItem>
                </Row>
                <FormItem>
                    <TextArea
                        label="Descrição*"
                        value={data.description || ""}
                        onChange={(event) =>
                            setData({
                                ...data,
                                description: event.target.value,
                            })
                        }
                    />
                </FormItem>
                <Row>
                    <FormItem md="6" sm="12">
                        <Input
                            label="Celular*"
                            value={data.cellphone || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    cellphone: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                    <FormItem md="6" sm="12">
                        <Input
                            label="Telefone"
                            value={data.telephone || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    telephone: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem md="4" sm="12">
                        <Input
                            label="Estado*"
                            value={data.state || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    state: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                    <FormItem md="4" sm="12">
                        <Input
                            label="Cidade*"
                            value={data.city || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    city: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                    <FormItem md="4" sm="12">
                        <Input
                            label="Bairro*"
                            value={data.neighborhood || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    neighborhood: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem md="6" sm="12">
                        <Input
                            label="Endereço*"
                            value={data.address || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    address: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                    <FormItem md="3" sm="12">
                        <Input
                            label="Número*"
                            value={data.number || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    number: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                    <FormItem md="3" sm="12">
                        <Input
                            label="Complemento"
                            value={data.complement || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    complement: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                </Row>
                <GridButtons>
                    <Button
                        onClick={() => {
                            history.push("/boards");
                        }}
                    >
                        <FaPaperPlane />
                        Confirmar
                    </Button>
                </GridButtons>
            </Form>
        </Container>
    );
};

export default Index;
