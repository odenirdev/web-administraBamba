import React from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";
import { FaEdit, FaClipboard } from "react-icons/fa";

const Grid = Styled(Col)`
    margin-bottom: 1rem;
    cursor: pointer;
`;

const Container = Styled.div`
    position: relative;

    background-color: var(--gray-5);
    box-shadow: var(--shadow);
    
    width: 100%;
    max-width: 450px;

    border-radius: 5px;

    &:hover .user-hover-container {
        visibility: visible;
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
    
    border-radius: 5px;

    & svg {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 100;        
        color: var(--gray-5);
    }
`;

const Title = Styled.section`
    font-size: 2rem;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 5px 5px 0 0;
    padding: 0 0.5rem;

    background-color: var(--color-primary);
    color: var(--gray-5);

    & svg {
        margin-right: 1rem; 
    }
    
`;

const Description = Styled.section`
    padding: 1rem;
    min-height: 75px;
    color: var(--gray-2);
`;

const Index = ({ title, description, onClick }) => (
    <Grid md="6">
        <Container onClick={onClick}>
            <HoverContainer>
                <FaEdit />
            </HoverContainer>
            <Title>
                <FaClipboard />
                <span>{title}</span>
            </Title>
            <Description>
                <span>{description}</span>
            </Description>
        </Container>
    </Grid>
);

export default Index;
