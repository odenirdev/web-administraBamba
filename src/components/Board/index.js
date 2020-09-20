import React from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";

const Grid = Styled(Col)`
    margin-bottom: 1rem;
    cursor: pointer;
`;

const Container = Styled.div`
    position: relative;

    background-color: var(--color-primary);
    
    width: 100%;
    max-width: 450px;

    border-radius: 5px;

    padding: 1rem;

    &:hover {
        filter: brightness(120%);
    }
`;

const Title = Styled.section`
    margin-bottom: 0.5rem;

    & h3 {
        margin: 0;
        color: var(--purple-1);
        font-size: 1.5rem;
    }
    
    & span {
        color: var(--gray-5);
        font-size: 2rem;
    }
`;

const Description = Styled(Title)` 
    & span {
        font-size: 1.5rem;
    }
`;

const Index = ({ title, description, onClick }) => (
    <Grid md="6">
        <Container onClick={onClick}>
            <Title>
                <h3>Título</h3>
                <span>{title}</span>
            </Title>
            <Description>
                <h3>Descrição</h3>
                <span>{description}</span>
            </Description>
        </Container>
    </Grid>
);

export default Index;
