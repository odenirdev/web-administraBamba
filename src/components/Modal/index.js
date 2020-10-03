import React from "react";
import Styled from "styled-components";
import { FaTimes } from "react-icons/fa";

const Button = Styled.button`
    border: 0;
    border-radius: 60px;
    
    padding: 0.8rem;
    
    font-size: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--gray-5);
    color: var(--color-primary);
    
    cursor: pointer;

    &:hover {
        filter: brightness(120%);
    }
`;

const Grid = Styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(26, 26, 26, 0.35);
    z-index: 100;

    display: ${(props) => (props.show ? "flex" : "none")};
    justify-content: center;
    align-items: center;
`;

const Container = Styled.div`
    position: absolute;
    width: 100%;
    max-width: 600px;
    min-width: 280px;
    height: fit-content;

    margin: 1rem 0.5rem;
    
    animation-name: animation;
    animation-duration: 200ms;

    @keyframes animation {
        from {
            opacity: 0;
            transform: scale(0);
        } to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;

const Header = Styled.header`
    padding: 0.3rem 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    border-radius: 5px 5px 0 0;
    
    background-color: var(--color-primary);
    
    & h2 {
        color: var(--gray-5);
    }
`;

const Section = Styled.section`
    background-color: var(--bg-color);
    padding: 0.5rem;
    border-radius: 0 0 5px 5px;

    max-height: 400px;
    overflow-y: auto;
`;

const Index = ({ show, title, children, onClose }) => {
    return (
        <Grid show={show || false}>
            <Container>
                <Header>
                    <h2>{title}</h2>
                    <Button onClick={onClose}>
                        <FaTimes />
                    </Button>
                </Header>
                <Section>{children}</Section>
            </Container>
        </Grid>
    );
};

export default Index;
