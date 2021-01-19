import React from "react";
import { Row, Col } from "react-bootstrap";

import DashboardMyBoards from "../DashboardMyBoards";
import DashboardBoards from "../DashboardBoards";
import DashboardWallet from "../DashboardWallet";
import DashboardInventoryMovement from "../DashboardInventoryMovement";
import Hr from "../Hr";

import { Container } from "./styles";

function Index() {
    return (
        <Container>
            <DashboardMyBoards />
            <Hr />
            <DashboardBoards />
            <Hr />
            <Row>
                <Col md="6">
                    <DashboardWallet />
                </Col>
                <Col md="6">
                    <DashboardInventoryMovement />
                </Col>
            </Row>
        </Container>
    );
}

export default Index;
