import React, { useEffect, useState } from "react";
import Styled from "styled-components";
import { Row } from "react-bootstrap";
import { FaEdit, FaSearch } from "react-icons/fa";
import "jquery-mask-plugin/dist/jquery.mask";
import $ from "jquery";
import Axios from "axios";

import Form, {
    Input,
    Select,
    TextArea,
    GridButtons,
    FormItem,
} from "../../components/Form";
import { File } from "../../components/Input";
import Button from "../../components/Button";
import Img from "../../components/Img";

import Api from "../../services/api";
import Confirm from "../../modules/alertConfirm";
import Notification, { Error } from "../../modules/notifications";

import EmptyImage from "../../assets/images/empty.jpg";
import System from "../../modules/system";

const Container = Styled.div`
    display: flex;
    justify-content: center;
`;

const SearchButton = Styled(Button)`
    padding: 0;
    margin: 0 0 2rem 0.5rem; 
    
    width: 64px;
    height: 64px;

    align-self: flex-end;
`;

const Index = ({ school, indexSchool }) => {
    const [data, setData] = useState(school);

    useEffect(() => {
        if (!(Object.keys(school.image).length === 0)) {
            setData({
                ...school,
                image: {
                    ...school.image,
                    preview: Api.defaults.baseURL + school.image.url,
                },
            });
        } else {
            setData(school);
        }
    }, [school]);

    useEffect(() => {
        $("#telephone").mask("(00) 0000-0000");
        $("#cellphone").mask("(00) 0 0000-0000");
        $("#cep").mask("00000-000");
    });

    const [ufs, setUfs] = useState([]);

    const [cities, setCities] = useState([]);

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
        const response = await Api.post("/upload", data);
        return response.data[0];
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const validate = handleValidate();
            if (!validate.status) {
                return Notification("warning", validate.message);
            }

            let resquestData = data;
            try {
                if (
                    !resquestData.image.id &&
                    !(Object.keys(resquestData.image.file).length === 0)
                ) {
                    const image = await uploadFile(resquestData.image.file);
                    resquestData.image = image;
                }
            } catch (error) {
                resquestData.image = {};
            }

            await Api.put(`/schools/${resquestData.id}`, resquestData);

            Notification("success", "Escola de samba atualizada");
            indexSchool();
        } catch (error) {
            Error(error);
        }
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mb-1">
                    {System.isAdmin() ? (
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
                                Confirm(
                                    "Remover Imagem",
                                    "Essa operação não pode ser desfeita, tem certeza ?",
                                    async () => {
                                        if (data.image.id) {
                                            await Api.delete(
                                                `/upload/files/${data.image.id}`
                                            );

                                            await Api.put(
                                                `/schools/${data.id}`,
                                                {
                                                    image: {},
                                                }
                                            );
                                        }

                                        setData({
                                            ...data,
                                            image: {},
                                        });
                                    }
                                );
                            }}
                        />
                    ) : (
                        <Img
                            width="200px"
                            height="200px"
                            src={
                                !(Object.keys(data.image).length === 0)
                                    ? Api.defaults.baseURL + data.image.url
                                    : EmptyImage
                            }
                        />
                    )}
                </div>
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
                            readOnly={!System.isAdmin()}
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
                            maxLength={50}
                            readOnly={!System.isAdmin()}
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
                        readOnly={!System.isAdmin()}
                    />
                </FormItem>
                <Row>
                    <FormItem sm="12" md="4">
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
                            readOnly={!System.isAdmin()}
                        />
                    </FormItem>
                    <FormItem sm="12" md="4">
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
                            readOnly={!System.isAdmin()}
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
                            readOnly={!System.isAdmin()}
                        />
                        {System.isAdmin() && (
                            <SearchButton onClick={searchCEP}>
                                <FaSearch />
                            </SearchButton>
                        )}
                    </FormItem>
                </Row>
                <Row>
                    <FormItem sm="12" md="4">
                        <Select
                            label="Estado*"
                            value={data.state || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    state: event.target.value,
                                })
                            }
                            disabled={!System.isAdmin()}
                        >
                            <option value="">Selecione...</option>
                            {ufs.map((uf) => (
                                <option key={uf} value={uf}>
                                    {uf}
                                </option>
                            ))}
                        </Select>
                    </FormItem>
                    <FormItem sm="12" md="4">
                        <Select
                            label="Cidade*"
                            value={data.city || ""}
                            onChange={(event) =>
                                setData({
                                    ...data,
                                    city: event.target.value,
                                })
                            }
                            disabled={!System.isAdmin()}
                        >
                            <option value="">Selecione...</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </Select>
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
                            readOnly={!System.isAdmin()}
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
                            readOnly={!System.isAdmin()}
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
                            readOnly={!System.isAdmin()}
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
                            readOnly={!System.isAdmin()}
                        />
                    </FormItem>
                </Row>
                {System.isAdmin() && (
                    <GridButtons>
                        <Button type="submit">
                            <FaEdit />
                            Editar
                        </Button>
                    </GridButtons>
                )}
            </Form>
        </Container>
    );
};

export default Index;
