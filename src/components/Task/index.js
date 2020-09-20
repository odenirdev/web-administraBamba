import React from "react";
import Styled from "styled-components";
import { Col, Row } from "react-bootstrap";
import { FaCalendarAlt, FaCalendarTimes } from "react-icons/fa";

const Grid = Styled(Row)`
    padding: 0.5rem;
`;

const Container = Styled(Col)`
    background-color: var(--color-primary);
    padding: 0.5rem;
    color: var(--gray-5);

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

const Index = ({ title, createdAt, dueDate, onClick }) => {
    return (
        <Grid>
            <Container onClick={onClick}>
                <header>
                    <span>{title}</span>
                </header>
                <div>
                    <span>
                        <FaCalendarAlt />
                        {createdAt}
                    </span>
                    <span>
                        <FaCalendarTimes />
                        {dueDate}
                    </span>
                </div>
            </Container>
        </Grid>
    );
};

export default Index;
