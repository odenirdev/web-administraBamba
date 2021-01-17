import React from "react";

import { Container } from "./styles";

function Index() {
    return (
        <Container>
            <h2>Minhas Tarefas</h2>
            <div>
                <span>Total: 10</span>
                <span>Pendentes: 4</span>
                <span>Atrasadas: 1</span>
                <span>Em progresso: 2</span>
                <span>Concluídas: 3</span>
            </div>
        </Container>
    );
}

export default Index;
