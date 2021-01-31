import React from "react";
import { FaBell } from "react-icons/fa";

import { Container, Notifications } from "./styles";

const Index = ({ number, onClick, title }) => {
    return (
        <>
            <Container {...{ onClick, title }}>
                {number !== 0 && <Notifications>{number}</Notifications>}
                <FaBell />
            </Container>
        </>
    );
};

export default Index;
