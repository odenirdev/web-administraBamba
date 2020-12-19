import React from "react";

import { Container, Grid } from "./styles";

function Index({ send, message, createdAt }) {
    function formmatDate() {
        let date = String(new Date(createdAt).toLocaleString());

        date = date.slice(0, date.length - 3);
        return date;
    }

    return (
        <Container>
            <Grid {...{ send }}>
                <p>{message}</p>
                <span>{formmatDate()}</span>
            </Grid>
        </Container>
    );
}

export default Index;
