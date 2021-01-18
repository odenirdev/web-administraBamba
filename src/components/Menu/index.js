import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

import { Container, Button, MenuContainer } from "./styles";

import System from "../../modules/system";

const Index = () => {
    const [display, setDisplay] = useState(false);

    return (
        <Container display={display}>
            <Button
                display={display}
                onClick={() => {
                    setDisplay(!display);
                }}
            >
                {display ? <FaTimes /> : <FaBars />}
            </Button>
            <MenuContainer display={display}>
                <Link to="/school">Escola</Link>
                <Link to="/boards">Quadros</Link>
                <Link to="/conversations">Conversas</Link>
                <Link to="/schedule">Calendário</Link>
                {System.isAdmin() && (
                    <>
                        <Link to="/assets">Atívos</Link>
                        <Link to="/wallet">Carteira</Link>
                    </>
                )}
            </MenuContainer>
        </Container>
    );
};

export default Index;
