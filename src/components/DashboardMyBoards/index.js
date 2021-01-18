import React from "react";
import { PieChart } from "react-minimal-pie-chart";

import { Container } from "./styles";

function Index() {
    return (
        <Container className="row">
            <h2 className="col-12">Meus Quadros</h2>
            <div className="my-boards-container row">
                <div className="col-6">
                    <PieChart
                        data={[
                            {
                                title: "Criados",
                                value: 2,
                                color: "var(--blue-3)",
                            },
                            {
                                title: "Contribuindo",
                                value: 8,
                                color: "var(--purple-4)",
                            },
                        ]}
                    />
                </div>
                <div className="col-6">
                    <span className="total">Total: 10</span>
                    <span className="created">Criados: 2</span>
                    <span className="contribution">Contribuindo: 8</span>
                </div>
            </div>
        </Container>
    );
}

export default Index;
