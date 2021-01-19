import React from "react";

import DashboardMyBoards from "../DashboardMyBoards";
import DashboardBoards from "../DashboardBoards";
import Hr from "../Hr";

import { Container } from "./styles";

function Index() {
    return (
        <Container>
            <DashboardMyBoards />
            <Hr />
            <DashboardBoards />
        </Container>
    );
}

export default Index;
