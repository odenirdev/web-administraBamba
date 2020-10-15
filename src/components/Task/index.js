import React from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";
import {
    FaCalendarAlt,
    FaCalendarTimes,
    FaEdit,
    FaTasks,
} from "react-icons/fa";

const Container = Styled(Col).attrs({
    className: "task",
})`
    background-color: var(--gray-5);
    color: var(--gray-2);
    max-width: 90%;
    margin: 10px auto;

    box-shadow: var(--shadow);


    border-radius: 3px;

    cursor: pointer;

    transition: 200ms;

    &:hover .user-hover-container {
        visibility: visible;
    }
    
    & header {
        transition: 200ms;
        background-color: var(--color-primary)!important;

        border-radius: 3px 3px 0 0;

        display: flex;
        justify-content: flex-start!important;

        & h2 {
            color: var(--gray-5)!important;
            font-size: 1.5rem;
            margin: 0 auto;
            padding: 0 0.5rem;

            & svg {
                margin-right: 1rem;
            }
        }
    }

    & span {
        display: flex;
        align-items: center;
        font-size: 1.2rem;
        padding: 0.5rem;

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
    border-radius: 3px;

    & svg {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 100;        
        color: var(--gray-5);
    }
`;

const Index = ({ title, created_at, dueDate, onClick, id, status }) => {
    return (
        <Container onClick={onClick} data-id={id} data-status={status}>
            <HoverContainer>
                <FaEdit />
            </HoverContainer>
            <header>
                <h2>
                    <FaTasks />
                    {title}
                </h2>
            </header>
            <div>
                <span>
                    <FaCalendarAlt />
                    {new Date(created_at).toLocaleDateString()}
                </span>
                {dueDate && (
                    <span>
                        <FaCalendarTimes />
                        {new Date(`${dueDate}T23:59:59`).toLocaleDateString()}
                    </span>
                )}
            </div>
        </Container>
    );
};

export default Index;
