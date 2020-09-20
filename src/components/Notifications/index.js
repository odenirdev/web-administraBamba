import React, { useState } from "react";
import Styled from "styled-components";
import { FaBell } from "react-icons/fa";

const Container = Styled.div`
    height: 100%;

    display: flex;
    align-items: center;

    position: relative;

    & svg {
        font-size: 32px;
        cursor: pointer;
    }

    margin-right: 2rem;

    color: var(--gray-5);
`;

const Notifications = Styled.div`
    width: 24px;
    height: 24px;

    border-radius: 12px;

    position: absolute;

    margin: 0 0 1em 1rem;

    background-color: var(--red-1);

    filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25));

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
`;

const Index = () => {
    const [notifications, setNotifications] = useState(5);

    return (
        <Container>
            {notifications > 0 && (
                <Notifications>{notifications}</Notifications>
            )}
            <FaBell />
        </Container>
    );
};

export default Index;
