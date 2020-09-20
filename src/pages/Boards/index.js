import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Styled from "styled-components";
import { Row } from "react-bootstrap";

import Container from "../../components/Container";
import AddButton from "../../components/AddButton";
import Board from "../../components/Board";
import { Input } from "../../components/Form";
import Modal from "../../components/Modal";

import BoardModal from "../../modals/Board";

const Header = Styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
`;

const Section = Styled.section`
    padding: 0 0.2rem;
`;

const Boards = Styled(Row)`
    & h1 {
        width: 100%;
    }
`;

const Index = () => {
    const history = useHistory();

    const [search, setSearch] = useState("");

    const [show, setShow] = useState(false);

    const [board, setBoard] = useState({});

    const [title, setTitle] = useState("Novo Quadro");

    const [myBoards, setMyBoards] = useState([
        {
            title: "Meu Quadro",
            description:
                "Suas tarefas de todos os quadros serão dispostas aqui",
        },
    ]);

    const [contributeBoards, setContributeBoards] = useState([
        {
            title: "Harmonia",
            description:
                "Tarefas dos harmonias durante a preparação do carnaval",
        },
        {
            title: "Ensaios",
            description: "Tarefas dos dos harmonias durante os ensaios",
        },
    ]);

    const handleAdd = () => {
        setTitle("Novo Quadro");
        setBoard({});
        setShow(true);
    };

    return (
        <>
            <Modal
                title={title}
                show={show}
                onClose={() => {
                    setShow(false);
                }}
            >
                <BoardModal board={board} />
            </Modal>
            <Container>
                <Header>
                    <Input
                        value={search}
                        label="Pesquisar"
                        max-width="250px"
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <AddButton onClick={handleAdd} />
                </Header>
                <Section>
                    <Boards>
                        <h1>Meus Quadros</h1>
                        {myBoards.map((board) => (
                            <Board
                                {...board}
                                onClick={() => {
                                    history.push("/board");
                                }}
                            />
                        ))}
                    </Boards>
                    <Boards>
                        <h1>Contribuindo</h1>
                        {contributeBoards.map((board) => (
                            <Board {...board} />
                        ))}
                    </Boards>
                </Section>
            </Container>
        </>
    );
};

export default Index;
