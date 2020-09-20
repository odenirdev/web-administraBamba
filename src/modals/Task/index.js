import React, { useEffect, useState } from "react";
import Styled from "styled-components";
import { Row } from "react-bootstrap";

import Form, {
    Input,
    GridButtons,
    TextArea,
    FormItem,
} from "../../components/Form";
import Button from "../../components/Button";
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";

const Container = Styled.div`
    display: flex;
    justify-content: center;
`;

const Index = ({ task }) => {
    const [data, setData] = useState({});

    useEffect(() => {
        setData({
            ...task,
            dueDate: `${!(Object.keys(task).length === 0) && "2020-08-18"}`,
        });
    }, [task]);

    return (
        <Container>
            <Form>
                <Row>
                    <FormItem>
                        <Input
                            type="text"
                            label="Título*"
                            value={data.title || ""}
                            onChange={(event) =>
                                setData({ ...data, title: event.target.value })
                            }
                        />
                    </FormItem>
                    <FormItem>
                        <Input
                            type="date"
                            label="Vencimento*"
                            value={data.dueDate || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    dueDate: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                </Row>
                <FormItem>
                    <TextArea
                        label="Descrição"
                        value={data.description || ""}
                        onChange={(event) =>
                            setData({
                                ...data,
                                description: event.target.value,
                            })
                        }
                    />
                </FormItem>
                <GridButtons>
                    {Object.keys(task).length === 0 ? (
                        <Button>
                            <FaPaperPlane /> Confirmar
                        </Button>
                    ) : (
                        <>
                            <Button color="var(--red-1)" variant="secundary">
                                <FaTrash />
                                Remover
                            </Button>
                            <Button>
                                <FaEdit />
                                Editar
                            </Button>
                        </>
                    )}
                </GridButtons>
            </Form>
        </Container>
    );
};

export default Index;
