import React, { useState } from "react";
import Styled from "styled-components";
import { Row } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

import Form, {
    Input,
    TextArea,
    GridButtons,
    FormItem,
} from "../../components/Form";
import { File } from "../../components/Input";
import Button from "../../components/Button";

const Container = Styled.div`
    display: flex;
    justify-content: center;
`;

const Index = ({ school }) => {
    const [data, setData] = useState(school);

    return (
        <Container>
            <Form>
                <FormItem className="d-flex justify-content-center mb-1">
                    <File width="200px" height="200px" src={data.image} />
                </FormItem>
                <Row>
                    <FormItem sm="12" md="6">
                        <Input
                            label="Nome*"
                            type="text"
                            value={data.name || ""}
                            onChange={(event) =>
                                setData({ ...data, name: event.target.value })
                            }
                            maxLength={30}
                        />
                    </FormItem>
                    <FormItem sm="12" md="6">
                        <Input
                            label="Email*"
                            type="email"
                            value={data.email || ""}
                            onChange={(event) =>
                                setData({ ...data, email: event.target.value })
                            }
                            maxLength={30}
                        />
                    </FormItem>
                </Row>
                <FormItem>
                    <TextArea
                        label="Descrição*"
                        type="text"
                        value={data.description || ""}
                        onChange={(event) =>
                            setData({
                                ...data,
                                description: event.target.value,
                            })
                        }
                        maxLength={280}
                    />
                </FormItem>
                <Row>
                    <FormItem sm="12" md="6">
                        <Input
                            label="Telefone"
                            type="text"
                            value={data.telephone || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    telephone: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                    <FormItem sm="12" md="6">
                        <Input
                            label="Celular"
                            type="text"
                            value={data.cellphone || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    cellphone: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem sm="12" md="4">
                        <Input
                            label="Estado*"
                            type="text"
                            value={data.state || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    state: event.target.value,
                                })
                            }
                            maxLength={30}
                        />
                    </FormItem>
                    <FormItem sm="12" md="4">
                        <Input
                            label="Cidade*"
                            type="text"
                            value={data.city || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    city: event.target.value,
                                })
                            }
                            maxLength={30}
                        />
                    </FormItem>
                    <FormItem sm="12" md="4">
                        <Input
                            label="Bairro*"
                            type="text"
                            value={data.neighborhood || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    neighborhood: event.target.value,
                                })
                            }
                            maxLength={30}
                        />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem sm="12" md="6">
                        <Input
                            label="Endereço*"
                            type="text"
                            value={data.address || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    address: event.target.value,
                                })
                            }
                            maxLength={30}
                        />
                    </FormItem>
                    <FormItem sm="12" md="3">
                        <Input
                            label="Número*"
                            type="number"
                            value={data.number || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    number: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                    <FormItem sm="12" md="3">
                        <Input
                            label="Complemento"
                            type="text"
                            value={data.complement || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    complement: event.target.value,
                                })
                            }
                            maxLength={30}
                        />
                    </FormItem>
                </Row>
                <GridButtons>
                    <Button>
                        <FaEdit />
                        Editar
                    </Button>
                </GridButtons>
            </Form>
        </Container>
    );
};

export default Index;
