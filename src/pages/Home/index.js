import React, { useEffect, useState, useCallback } from "react";
import Styled from "styled-components";

import Container from "../../components/Container";
import Img from "../../components/Img";
import Spinner, {
    Container as ContainerSpinner,
} from "../../components/SpinnerLoader";

import Board from "../../components/Board";
import Button from "../../components/Button";
import TableAdmin from "../../components/TableAdmin";
import Historic from "../../components/Historic";

import Api from "../../services/api";

import SchoolFail from "../../pages/SchoolFail";
import RegisterSchool from "../../pages/RegisterSchool";

import ADSAMBAIcon from "../../assets/images/adsamba-logo.png";

const Main = Styled.main`
    ul {
        list-style: none;
    }
`;

const Grid = Styled.li`
    display: ${(props) => (props.show ? "block" : "none")};
`;

const Index = () => {
    const [statusSchool, setStatusSchool] = useState(0);

    const [me, setMe] = useState(0);

    const [board, setBoard] = useState({
        title: "Minhas Tarefas",
        description: "Lista das tarefas que você contribui",
    });

    const [stateGrid, setStateGrid] = useState(1);

    const indexTasks = useCallback(() => {
        async function indexTasks() {
            try {
                const response = await Api.get(
                    `/tasks?_limit=-1&users_in=${me.id}`
                );

                if (
                    JSON.stringify(board.tasks) !==
                    JSON.stringify(response.data)
                ) {
                    setBoard({ ...board, tasks: response.data });
                }
            } catch (error) {
                Error(error);
            }
        }

        indexTasks();
    }, [board, me.id, setBoard]);

    useEffect(() => {
        indexTasks();
    }, [indexTasks]);

    useEffect(() => {
        async function authSchool() {
            const response = await Api.get("/schools/count");
            if (response.data === 0) {
                if (me.role === 4) {
                    setStatusSchool(1);
                } else {
                    setStatusSchool(2);
                }
            }
        }

        authSchool();
    }, [me.role]);

    useEffect(() => {
        async function showMe() {
            try {
                const response = await Api.get("/users/me");

                try {
                    setMe({ ...response.data, role: response.data.role.id });
                } catch (err) {}
            } catch (error) {
                Error(error);
            }
        }

        showMe();
    }, []);

    function handleClickNavButtons({ target }) {
        setStateGrid(parseInt(target.dataset.value));

        const buttonsEl = document.querySelectorAll("#nav-buttons button");
        buttonsEl.forEach((button) => {
            if (target.dataset.value === button.dataset.value) {
                button.setAttribute("disabled", "true");
            } else {
                button.removeAttribute("disabled");
            }
        });
    }

    if (!me && statusSchool === 0) {
        return (
            <ContainerSpinner>
                <Img src={ADSAMBAIcon} width="250px" />
                <Spinner />
            </ContainerSpinner>
        );
    }

    if (statusSchool === 2) {
        return <SchoolFail />;
    }

    if (statusSchool === 1) {
        return <RegisterSchool />;
    }

    return (
        <Container>
            <Main>
                {me.role === 4 && (
                    <nav className="d-flex mb-2 row" id="nav-buttons">
                        <Button
                            data-value="1"
                            onClick={handleClickNavButtons}
                            className="ml-0"
                        >
                            Minhas Tarefas
                        </Button>
                        <Button data-value="2" onClick={handleClickNavButtons}>
                            Relatório de Quadros
                        </Button>
                    </nav>
                )}
                <ul>
                    <Grid show={stateGrid === 1}>
                        <Board board={board} indexTasks={indexTasks} />
                    </Grid>
                    <Grid show={stateGrid === 2}>
                        <TableAdmin />
                    </Grid>
                </ul>
            </Main>
        </Container>
    );
};

export default Index;
