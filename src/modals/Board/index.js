import React, { useState, useEffect } from "react";
import Styled from "styled-components";

import Form, { Input, GridButtons, TextArea } from "../../components/Form";
import Button from "../../components/Button";
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";

const Container = Styled.div`
    display: flex;
    justify-content: center;
`;

const Index = ({ board }) => {
    const [data, setData] = useState(board);

    useEffect(() => {
        if (data !== board) {
            setData(board);
        }
    }, [board, data]);

    return (
        <Container>
            <Form max-width="70%" sm-max-width="100%">
                <Input
                    label="Título"
                    onChange={(event) =>
                        setData({ ...data, title: event.target.value })
                    }
                    maxLength={30}
                    value={data.title || ""}
                />
                <TextArea
                    label="Descrição"
                    onChange={(event) =>
                        setData({ ...data, description: event.target.value })
                    }
                    maxLength={280}
                    value={data.description || ""}
                />
                <GridButtons>
                    {Object.keys(board).length === 0 ? (
                        <Button>
                            <FaPaperPlane />
                            Confirmar
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
