import React from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import EmptyImage from "../../assets/images/empty.jpg";

import Api from "../../services/api";

import {
    Grid,
    Container,
    HoverContainer,
    ImageContainer,
    StyledImg,
    FieldsContainer,
    Field,
} from "./styles";

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
