import React from "react";
import Styled from "styled-components";
import { FaPlus } from "react-icons/fa";

const Button = Styled.button`
    border: 0;
    border-radius: 120px;
    
    padding: 1rem;
    margin-left: 1rem;
    height: fit-content;
    
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

`;

const Index = ({ onClick }) => (
    <Button onClick={onClick}>
        <FaPlus />
    </Button>
);

export default Index;
