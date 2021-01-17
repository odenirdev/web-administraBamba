import React from "react";

import Schedule from "../../components/Schedule";
import AuthContainer from "../../components/Container";

import { Container } from "./styles";

function Index() {
    return (
        <AuthContainer>
            <Container>
                <Schedule />
            </Container>
        </AuthContainer>
    );
}

export default Index;
