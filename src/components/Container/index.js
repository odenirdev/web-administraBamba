import React from "react";
import Styled from "styled-components";

import Navbar from "../Navbar";
import Menu from "../Menu";
import Main from "../Main";

const Container = Styled.div`
    width: 100%;
    min-height: 100vh;
`;

const Index = (props) => {
    return (
        <Container>
            <Navbar />
            <Main>{props.children}</Main>
            <Menu />
        </Container>
    );
};

export default Index;
