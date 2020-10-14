import React from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";
import { FaCalendarAlt, FaCalendarTimes } from "react-icons/fa";

const Container = Styled(Col).attrs({
    className: "task",
})`
    background-color: var(--gray-5);
    padding: 0.5rem;
    color: var(--gray-2);
    max-width: 90%;
    margin: 10px auto;

    box-shadow: var(--shadow);


    border-radius: 3px;

    cursor: pointer;

    transition: 200ms;

    &:hover {
        background-color: var(--purple-5);
    }

    &:hover header {
        background-color: var(--purple-5)!important;
    }
    
    & header {
        transition: 200ms;
        background-color: var(--gray-5)!important;
        color: var(--gray-2)!important;

        display: flex;
        justify-content: flex-start!important;
    }

    & span {
        display: flex;
        align-items: center;
        font-size: 1.2rem;

        & svg {
            margin-right: 5px;
        }
    } 

    & div {
        display: flex;
        justify-content: space-between;
    }

    @media (max-width: 750px) {
        & div {
            flex-direction: column;
            align-items: center;
        }

        & header {
            text-align: center;

        }
    }

`;

const Index = ({ title, created_at, dueDate, onClick, id, status }) => {
    return (
        <Container onClick={onClick} data-id={id} data-status={status}>
            <header>
                <span>{title}</span>
            </header>
            <div>
                <span>
                    <FaCalendarAlt />
                    {new Date(created_at).toLocaleDateString()}
                </span>
                {dueDate && (
                    <span>
                        <FaCalendarTimes />
                        {new Date(dueDate).toLocaleDateString()}
                    </span>
                )}
            </div>
        </Container>
    );
};

export default Index;
