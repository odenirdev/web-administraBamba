import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";

import Form, {
    Input,
    GridButtons,
    Select,
    FormItem,
} from "../../components/Form";
import { File } from "../../components/Input";
import Button from "../../components/Button";

const Container = Styled.div`
    display: flex;
    justify-content: center;
`;

const Index = ({ user }) => {
    const [data, setData] = useState({});

    useEffect(() => {
        setData(user);
    }, [user]);

    return (
        <Container>
            <Form max-width="70%" sm-max-width="100%">
                <FormItem className="d-flex justify-content-center">
                    <File width="120px" height="120px" src={data.image} />
                </FormItem>
                <Input
                    label="Nome"
                    onChange={(event) => {
                        setData({ ...data, name: event.target.value });
                    }}
                    maxLength={30}
                    value={data.name || ""}
                />
                <Input
                    label="E-Mail"
                    onChange={(event) => {
                        setData({ ...data, email: event.target.value });
                    }}
                    maxLength={30}
                    value={data.email || ""}
                />
                <Select
                    label="Nível de Acesso"
                    value={data.access_level || ""}
                    onChange={(event) => {
                        setData({
                            ...data,
                            access_level: parseInt(event.target.value),
                        });
                    }}
                >
                    <option value="">Selecione...</option>
                    <option value="3">Diretoria</option>
                    <option value="2">Harmonia</option>
                    <option value="1">Componente</option>
                </Select>
                <GridButtons>
                    {Object.keys(user).length === 0 ? (
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
