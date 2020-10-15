import React from "react";
import Styled from "styled-components";
import { FaPlus } from "react-icons/fa";

const Button = Styled.button`
    border: 0;
    border-radius: 27px;
    
    margin-left: 1rem;
    height: 54px;
    width: 54px;
    
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
        font-size: 1rem;
        margin: 0 0.2rem 0.5rem 0;
    }
    
    & .add-icon {
        font-size: 1.5rem;
    }

`;

const Index = ({ onClick, Icon = () => <></> }) => (
    <Button onClick={onClick}>
        <FaPlus className="add-plus-icon" />
        <Icon className="add-icon" />
    </Button>
);

export default Index;
