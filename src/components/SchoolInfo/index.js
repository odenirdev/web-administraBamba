import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import { Row, Col } from "react-bootstrap";
import { FaEdit, FaEye } from "react-icons/fa";

import Img from "../../components/Img";

import Api from "../../services/api";

import EmptyImage from "../../assets/images/empty.jpg";

const Container = Styled.div`
    background-color: var(--gray-5);
    margin: 1rem;
    padding: 1.5rem;
    box-shadow: var(--shadow);

    border-radius: 2px;
    position: relative;

    cursor: pointer;

    &:hover .school-hover-container {
        visibility: visible;
    }
`;

const HoverContainer = Styled.div.attrs({
    className: "school-hover-container",
})`
    visibility: hidden;
    width: 100%;
    height: 100%;
    background-color: rgba(26, 26, 26, 0.4);
    
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;

    border-radius: 2px;

    filter: brightness(200%);

    transition: filter 300m, visibility 200m;

    & svg {
        position: absolute;
        bottom: 5px;
        right: 5px;
        z-index: 100;
        
        font-size: 2rem;
        
        color: var(--gray-5);
    }
`;

const Field = Styled.div`

    & h3 {
        color: var(--purple-1);
        font-size: 1.5rem;
        margin: 0;
    }

    & span {
        color: var(--gray-1);
        font-size: 1.3rem;
    }

    & span.description {
        font-size: 1.2rem;
    }
`;

const AddressField = Styled(Col)`
    padding: 0.2rem;

    & h3 {
        margin: 0;
        color: var(--purple-1);
        font-size: 1.3rem;
    }

    & span {
        color: var(--gray-1);
        font-size: 1.2rem;
    }
`;

const ContainerImg = Styled(Col)`
    display: flex;
    justify-content: center;

    padding-bottom: 1rem;
`;

const Index = ({ school, onClick, me }) => {
    const [data, setData] = useState(school);

    useEffect(() => {
        if (school !== data) {
            setData(school);
        }
    }, [data, school]);

    return (
        <Container onClick={onClick}>
            <HoverContainer>
                {me.role === 4 ? <FaEdit /> : <FaEye />}
            </HoverContainer>

            <Row>
                <ContainerImg md="4" sm="12">
                    <Img
                        src={
                            !(Object.keys(data.image).length === 0)
                                ? Api.defaults.baseURL + data.image.url
                                : EmptyImage
                        }
                        width="200px"
                        height="200px"
                    />
                </ContainerImg>
                <Col md="4" sm="12" className="p-0">
                    <Field>
                        <h3>Escola de Samba</h3>
                        <span>{data.name}</span>
                    </Field>
                    <Field>
                        <h3>Data de Fundação</h3>
                        <span>
                            {new Date(data.foundationDate).toLocaleDateString()}
                        </span>
                    </Field>
                </Col>
                <Col md="4" sm="12" className="p-0">
                    <Field>
                        <h3>Descrição</h3>
                        <span className="description">{data.description}</span>
                    </Field>
                </Col>
            </Row>
            <Row>
                <AddressField md="2" sm="12">
                    <h3>Estado</h3>
                    <span>{data.state}</span>
                </AddressField>
                <AddressField md="2" sm="12">
                    <h3>Cidade</h3>
                    <span>{data.city}</span>
                </AddressField>
                <AddressField md="2" sm="12">
                    <h3>Bairro</h3>
                    <span>{data.neighborhood}</span>
                </AddressField>
                <AddressField md="2" sm="12">
                    <h3>Endereço</h3>
                    <span>{data.address}</span>
                </AddressField>
                <AddressField md="2" sm="12">
                    <h3>Numero</h3>
                    <span>{data.number}</span>
                </AddressField>
                <AddressField md="2" sm="12">
                    <h3>Complemento</h3>
                    <span>{data.complement || "N/A"}</span>
                </AddressField>
            </Row>
        </Container>
    );
};

export default Index;
