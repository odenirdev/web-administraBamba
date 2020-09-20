import React, { useState } from "react";
import Styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa";

import Form, { Input, GridButtons } from "../../components/Form";
import Button from "../../components/Button";

const Container = Styled.div`
    display: flex;
    justify-content: center;
`;

const Index = () => {
    const [data, setData] = useState({
        name: "Odenir Gomes",
        email: "odenirdev@gmail.com",
    });

    return (
        <Container>
            <Form max-width="70%" sm-max-width="100%">
                <Input
                    label="Nome"
                    onChange={(event) =>
                        setData({ ...data, name: event.target.value })
                    }
                    maxLength={30}
                    value={data.name}
                />
                <Input
                    label="E-Mail"
                    onChange={(event) =>
                        setData({ ...data, email: event.target.value })
                    }
                    maxLength={30}
                    value={data.email}
                />
                <GridButtons>
                    <Button color="var(--red-1)" variant="secundary">
                        <FaTrash />
                        Remover
                    </Button>
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
