import React, { useState } from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

import Container from "../../components/Container";
import { Input } from "../../components/Form";
import Modal from "../../components/Modal";
import AddButton from "../../components/AddButton";
import Task from "../../components/Task";

import BoardModal from "../../modals/Board";
import TaskModal from "../../modals/Task";

const Header = Styled.header.attrs({
    className: "row",
})`
`;

const Information = Styled(Col)`
    position: relative;

    & svg {
        position: absolute;
        top: 0;
        right: 0;

        cursor: pointer;
        color: var(--gray-2);

        transition: 200ms;

        &:hover {
            color: var(--color-primary);
            filter: brightness(120%);
        }
    }
`;

const Title = Styled(Col)`
    & h3 {
        color: var(--purple-1);
        margin: 0;
    }

    & span {
        color: var(--gray-1);
    }
`;

const Description = Styled(Title)`
    margin-top: 0.5rem;

    & span {
        color: var(--gray-1);
    }
`;

const Board = Styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const Column = Styled.div`
    background-color: var(--gray-5);
    border: 1px solid var(--color-primary);
    width: 33%;

    max-height: 600px;
    overflow-y: auto;


    & header {
        display: flex;
        justify-content: center;
        padding: 0.5rem 0;

        font-family: var(--font-title);

        color: var(--gray-5);
        background-color: var(--color-primary);
    }
`;

const AddContainer = Styled.div`
    display: flex;
    flex-direction: row-reverse;
    padding: 0.5rem;
`;

const Index = () => {
    const [search, setSearch] = useState("");

    const [showBoard, setShowBoard] = useState(false);

    const [showTask, setShowTask] = useState(false);

    const [selectedTask, setSelectedTask] = useState({});

    const [board, setBoard] = useState({
        title: "Minhas Tarefas",
        description: "Suas tarefas de todos os quadros serão dispostas aqui",
    });

    const [tasks, setTasks] = useState([
        {
            title: "Confeccionar 200 fantasias",
            createdAt: "18/08/2020",
            dueDate: "31/08/2020",
        },
    ]);

    return (
        <>
            <Modal
                show={showTask}
                onClose={() => {
                    setShowTask(false);
                }}
                title={
                    Object.keys(selectedTask).length === 0
                        ? "Nova Tarefa"
                        : `Tarefa ${selectedTask.title}`
                }
            >
                <TaskModal task={selectedTask} />
            </Modal>
            <Modal
                show={showBoard}
                onClose={() => {
                    setShowBoard(false);
                    setSelectedTask({});
                }}
                title={`Quadro ${board.title}`}
            >
                <BoardModal board={board} />
            </Modal>
            <Container>
                <Header sm="12" md="8">
                    <Information>
                        <Title>
                            <h3>Título</h3>
                            <span>{board.title}</span>
                        </Title>
                        <Description>
                            <h3>Descrição</h3>
                            <span>{board.description}</span>
                        </Description>
                        <FaEdit onClick={() => setShowBoard(true)} />
                    </Information>
                    <Col sm="12" md="4">
                        <Input
                            value={search}
                            label="Pesquisar"
                            max-width="250px"
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </Col>
                </Header>
                <Board>
                    <Column>
                        <header>Tarefas</header>
                        {tasks.map((task) => (
                            <Task
                                {...task}
                                onClick={() => {
                                    setSelectedTask(task);
                                    setShowTask(true);
                                }}
                            />
                        ))}
                        <AddContainer>
                            <AddButton
                                onClick={() => {
                                    setSelectedTask({});
                                    setShowTask(true);
                                }}
                            />
                        </AddContainer>
                    </Column>
                    <Column>
                        <header>Fazendo</header>
                    </Column>
                    <Column>
                        <header>Concluídas</header>
                    </Column>
                </Board>
            </Container>
        </>
    );
};

export default Index;
