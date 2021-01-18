import React from "react";
import { Row, Col } from "react-bootstrap";

import Boards from "../DashboardMyBoards";
import Tasks from "../DashboardMyTasks";

import { Container } from "./styles";

function Index() {
    return (
        <Container>
            <Row>
                <Col className="my-boards">
                    <Boards />
                </Col>
                <Col>
                    <Tasks />
                </Col>
            </Row>
        </Container>
    );
}

export default Index;
