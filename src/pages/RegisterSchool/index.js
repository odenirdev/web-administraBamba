import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import { Row } from "react-bootstrap";
import { FaPaperPlane, FaSearch } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import "jquery-mask-plugin/dist/jquery.mask";
import $ from "jquery";
import Axios from "axios";

import Form, {
    Input,
    Select,
    TextArea,
    FormItem,
    GridButtons,
} from "../../components/Form";
import Button from "../../components/Button";
import { File } from "../../components/Input";

import Api, { requestPublic } from "../../services/api";
import Notification, { Error } from "../../modules/notifications";

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

const SearchButton = Styled(Button)`
    padding: 0;
    margin: 0 0 2rem 0.5rem; 
    
    width: 64px;
    height: 64px;

    align-self: flex-end;
`;

const Index = () => {
    const history = useHistory();

    const [data, setData] = useState({});

    const [ufs, setUfs] = useState([]);

    const [cities, setCities] = useState([]);

    useEffect(() => {
        $("#telephone").mask("(00) 0000-0000");
        $("#cellphone").mask("(00) 0 0000-0000");
        $("#cep").mask("00000-000");
    });

    useEffect(() => {
        async function renderUfs() {
            const response = await Axios.get(
                "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
            );

            const ufInitials = response.data.map((uf) => uf.sigla);
            setUfs(ufInitials);
        }

        renderUfs();
    }, []);

    useEffect(() => {
        async function renderCities() {
            const response = await Axios.get(
                `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${data.state}/municipios`
            );

            const cities = response.data.map((city) => city.nome);
            setCities(cities);
        }

        renderCities();
    }, [data.state]);

    async function searchCEP(event) {
        event.preventDefault();
        try {
            const cep = $("#cep").cleanVal();

            const { data: cepData } = await Axios.get(
                `https://viacep.com.br/ws/${cep}/json/`
            );

            const { uf, localidade, bairro, logradouro } = cepData;

            setData({
                ...data,
                neighborhood: bairro,
                address: logradouro,
                state: uf,
                city: localidade,
            });

            return;
        } catch (error) {
            return Notification("Buscar informações sobre o cep falhou");
        }
    }

    function handleValidate() {
        if (!data.name) {
            return { status: false, message: "Nome é obrigatório" };
        }

        if (!data.email) {
            return { status: false, message: "E-mail é obrigatório" };
        }

        if (!data.description) {
            return { status: false, message: "Descrição é obrigatório" };
        }

        if (!data.state) {
            return { status: false, message: "Estado é obrigatório" };
        }

        if (!data.city) {
            return { status: false, message: "Cidade é obrigatório" };
        }

        if (!data.neighborhood) {
            return { status: false, message: "Bairro é obrigatório" };
        }

        if (!data.address) {
            return { status: false, message: "Endereço é obrigatório" };
        }

        if (!data.number) {
            return { status: false, message: "Número é obrigatório" };
        }

        return { status: true };
    }

    async function uploadFile(file) {
        let data = new FormData();
        data.append(`files`, file);
        const response = await Api.post("/upload", data, requestPublic);
        return response.data[0];
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const validate = handleValidate();
            if (!validate.status) {
                return Notification("warning", validate.message);
            }

            try {
                if (!(Object.keys(data.image.file).length === 0)) {
                    const image = await uploadFile(data.image.file);
                    data.image = image;
                } else {
                    data.image = {};
                }
            } catch (error) {
                data.image = {};
            }

            await Api.post("/schools", data);

            Notification("success", "Escola de samba configurada");
            history.push("/boards");
        } catch (error) {
            Error(error);
        }
    }

    return (
        <Container>
            <Header>
                <h1>Cadastrar Escola de Samba</h1>
            </Header>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center">
                    <File
                        width={200}
                        height={200}
                        file={data.image}
                        onUpload={(files) => {
                            const file = files[0];

                            setData({
                                ...data,
                                image: {
                                    file,
                                    preview: URL.createObjectURL(file),
                                },
                            });
                        }}
                        onDeleteFile={() => {
                            setData({
                                ...data,
                                image: {},
                            });
                        }}
                    />
                </div>
                <Row>
                    <FormItem md="4" sm="12">
                        <Input
                            label="Nome*"
                            value={data.name || ""}
                            onChange={(event) =>
                                setData({ ...data, name: event.target.value })
                            }
                        />
                    </FormItem>
                    <FormItem md="4" sm="12">
                        <Input
                            label="E-mail*"
                            value={data.email || ""}
                            onChange={(event) =>
                                setData({ ...data, email: event.target.value })
                            }
                        />
                    </FormItem>
                    <FormItem md="4" sm="12">
                        <Input
                            type="date"
                            label="Fundação*"
                            value={data.foundationDate || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    foundationDate: event.target.value,
                                })
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
                    <FormItem md="4" sm="12">
                        <Input
                            id="cellphone"
                            label="Celular"
                            value={data.cellphone || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    cellphone: event.target.value,
                                })
                            }
                        />
                    </FormItem>
                    <FormItem md="4" sm="12">
                        <Input
                            id="telephone"
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
                    <FormItem className="d-flex" md="4" sm="12">
                        <Input
                            id="cep"
                            label="CEP*"
                            value={data.cep || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    cep: event.target.value,
                                })
                            }
                        />
                        <SearchButton onClick={searchCEP}>
                            <FaSearch />
                        </SearchButton>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem md="4" sm="12">
                        <Select
                            label="Estado*"
                            value={data.state || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    state: event.target.value,
                                })
                            }
                        >
                            <option value="">Selecione...</option>
                            {ufs.map((uf) => (
                                <option value={uf}>{uf}</option>
                            ))}
                        </Select>
                    </FormItem>
                    <FormItem md="4" sm="12">
                        <Select
                            label="Cidade*"
                            value={data.city || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    city: event.target.value,
                                })
                            }
                        >
                            <option value="">Selecione...</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </Select>
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
                    <Button type="submit">
                        <FaPaperPlane />
                        Confirmar
                    </Button>
                </GridButtons>
            </Form>
        </Container>
    );
};

export default Index;
