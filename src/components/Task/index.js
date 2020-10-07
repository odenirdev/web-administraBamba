import React from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";
import { FaCalendarAlt, FaCalendarTimes } from "react-icons/fa";

const Container = Styled(Col).attrs({
    className: "task",
})`
    background-color: var(--color-primary);
    padding: 0.5rem;
    color: var(--gray-5);
    max-width: 90%;
    margin: 10px auto;

    border-radius: 3px;

    cursor: pointer;

    transition: 200ms;

    &:hover {
        filter: brightness(120%);
    }
    
    & header {
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
