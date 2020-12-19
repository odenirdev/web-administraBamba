import React from "react";

import Container from "../../components/Container";
import Conversations from "../../components/Conversations";

function Index({ match: { params } }) {
    return (
        <Container>
            <Conversations selected={params.id} />
        </Container>
    );
}

export default Index;
