import React from "react";

import { Container } from "./styles";

import Notification from "../Notification";

function Index({ show, notifications }) {
    return (
        <Container {...{ show }}>
            {notifications.map((notification) => (
                <Notification key={notification.id} {...notification} />
            ))}
        </Container>
    );
}

export default Index;
