import React from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";
import { FaEdit, FaEye } from "react-icons/fa";

import Img from "../Img";

import EmptyImage from "../../assets/images/empty.jpg";

import Api from "../../services/api";

const Grid = Styled(Col)`
    margin: 0.5rem 0;
`;

const Container = Styled(Col)`
    width: 100%;
    background-color: var(--color-primary);

    display: flex;

    border-radius: 2px;

    padding: 0.5rem;

    cursor: pointer;

    &:hover .user-hover-container {
        visibility: visible;
    }

`;

const ImageContainer = Styled(Col)`
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 0;
`;

const FieldsContainer = Styled(Col)`

`;

const StyledImg = Styled(Img)`
    width: 62px;
    height: 62px;
    border-radius: 50%;
`;

const Field = Styled(Col)`
    margin: 0.2rem;

    & h3 {
        color: var(--purple-1);
        font-size: 1.3rem;
        margin: 0;
    }

    & span {
        color: var(--gray-5);
        font-size: 1.2rem;
    }
`;

const HoverContainer = Styled.div.attrs({
    className: "user-hover-container",
})`
    visibility: hidden;

    width: 100%;
    height: 100%;
    background-color: rgba(26, 26, 26, 0.4);

    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;

    & svg {
        position: absolute;
        bottom: 5px;
        right: 5px;
        z-index: 100;        
        color: var(--gray-5);
    }
`;

const Index = ({ user, onClick, meRole }) => {
    return (
        <Grid md="6" sm="12">
            <Container onClick={onClick}>
                <HoverContainer>
                    {meRole === 4 ? <FaEdit /> : <FaEye />}
                </HoverContainer>
                <ImageContainer sm="3">
                    <StyledImg
                        src={
                            !(Object.keys(user.image).length === 0)
                                ? Api.defaults.baseURL + user.image.url
                                : EmptyImage
                        }
                    />
                </ImageContainer>
                <FieldsContainer sm="7">
                    <Field>
                        <h3>Nome</h3>
                        <span>{user.username}</span>
                    </Field>
                    <Field>
                        <h3>E-mail</h3>
                        <span>{user.email}</span>
                    </Field>
                </FieldsContainer>
            </Container>
        </Grid>
    );
};

export default Index;
