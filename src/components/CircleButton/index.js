import React from "react";
import Styled from "styled-components";

const Button = Styled.button`
    border: 0;
    border-radius: 21px;
    
    height: 42px;
    width: 42px;
    
    font-size: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--color-primary);
    color: var(--gray-5);
    
    cursor: pointer;

    &:hover {
        filter: brightness(120%);
    }

    & .add-plus-icon {
        font-size: 0.8rem;
    }
    
    & .add-icon {
        font-size: 1.2rem;
        margin-left: 0.2rem;

    }

`;

const Index = ({ onClick, Icon = () => <></>, title = "" }) => (
    <Button {...{ onClick, title }}>
        <Icon className="add-icon" />
    </Button>
);

export default Index;
