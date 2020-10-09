import React, { useState, useEffect, useCallback } from "react";
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

import Api from "../../services/api";
import { Error } from "../../modules/notifications";

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

const Boards = Styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;

    @media (max-width: 750px) {
        flex-direction: column;
    }
`;

const Board = Styled.div`
    background-color: var(--gray-5);
    border: 1px solid var(--color-primary);
    width: 24.8%;

    @media (max-width: 750px) {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 1rem;
    }

    & header {
        display: flex;
        justify-content: center;
        padding: 0.5rem 0;

        font-family: var(--font-title);

        color: var(--gray-5);
        background-color: var(--color-primary);
        width: 100%;
    }
`;

const Dropzone = Styled.div.attrs({
    className: "dropzone",
})`
    width: 100%;
    min-height: 100px;
    max-height: 500px;
    overflow-y: auto;

    transition: 400ms;
`;

const AddContainer = Styled.div`
    display: flex;
    flex-direction: row-reverse;
    padding: 0.5rem;
`;

const Index = (props) => {
    const [search, setSearch] = useState("");

    const [me, setMe] = useState("");

    const [showBoard, setShowBoard] = useState(false);

    const [showTask, setShowTask] = useState(false);

    const [selectedTask, setSelectedTask] = useState({});

    const [board, setBoard] = useState({});

    const [allTasks, setAllTasks] = useState([]);

    const [filteredTasks, setFilteredTasks] = useState([]);

    const [overDue, setOverDue] = useState([]);

    const [tasks, setTasks] = useState([]);

    const [doing, setDoing] = useState([]);

    const [done, setDone] = useState([]);

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

    const indexTasks = useCallback(() => {
        async function indexTasks() {
            try {
                const response = await Api.get(
                    `/tasks?_limit=-1&board=${board.id}`
                );

                setAllTasks(response.data);
            } catch (error) {
                Error(error);
            }
        }

        indexTasks();
    }, [board.id]);

    useEffect(() => {
        indexTasks();
    }, [indexTasks]);

    useEffect(() => {
        const tasks = filteredTasks.filter((task) => task.status === 1 && !isOverDue(task.dueDate));

        const overDue = filteredTasks.filter((task) => (task.status === 1 && isOverDue(task.dueDate)));

        const doing = filteredTasks.filter((task) => task.status === 2);

        const done = filteredTasks.filter((task) => task.status === 3);

        setTasks(tasks);
        setDoing(doing);
        setDone(done);
        setOverDue(overDue);
    }, [filteredTasks]);

    useEffect(() => {
        if (search) {
            const filteredTasks = allTasks.filter((task) => {
                return (
                    task.title.includes(search) ||
                    new Date(task.created_at)
                        .toLocaleDateString()
                        .includes(search) ||
                    new Date(task.dueDate).toLocaleDateString().includes(search)
                );
            });

            setFilteredTasks(filteredTasks);
        } else {
            setFilteredTasks(allTasks);
        }
    }, [allTasks, search]);

    function isOverDue(date) {
        if (!date) {
            return false;
        }
        const dueDate = new Date(new Date(date).toLocaleDateString()).getTime();
        const today =  new Date(new Date().toLocaleDateString()).getTime()
        return (dueDate < today);
    }

    const indexBoard = useCallback(() => {
        async function show() {
            try {
                const { id } = props.match.params;

                const response = await Api.get(`/boards/${id}`);

                setBoard(response.data);
            } catch (error) {
                Error(error);
            }
        }

        show();
    }, [props.match.params]);

    useEffect(() => {
        indexBoard();
    }, [indexBoard]);

    return (
        <>
            <Modal
                show={showTask}
                onClose={() => {
                    setSelectedTask({});
                    setShowTask(false);
                }}
                title={
                    Object.keys(selectedTask).length === 0
                        ? "Nova Tarefa"
                        : `Tarefa ${selectedTask.title}`
                }
            >
                <TaskModal
                    id={selectedTask.id}
                    idBoard={board.id}
                    me={me}
                    index={indexTasks}
                    onClose={() => {
                        setShowTask(false);
                        setSelectedTask({});
                    }}
                />
            </Modal>
            <Modal
                show={showBoard}
                title={`Quadro ${board.title}`}
                onClose={() => {
                    setShowBoard(false);
                    setSelectedTask({ users: [] });
                }}
            >
                <BoardModal
                    board={board}
                    me={me}
                    onClose={() => {
                        setShowBoard(false);
                        setSelectedTask({});
                    }}
                    index={indexBoard}
                />
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
                <Boards>
                <Board>
                        <header>Atrasados</header>
                        <Dropzone>
                            {overDue.map((task) => (
                                <Task
                                    key={task.id}
                                    {...task}
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setShowTask(true);
                                    }}
                                />
                            ))}
                        </Dropzone>
                    </Board>
                    <Board>
                        <header>Tarefas</header>
                        <Dropzone>
                            {tasks.map((task) => (
                                <Task
                                    key={task.id}
                                    {...task}
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setShowTask(true);
                                    }}
                                />
                            ))}
                        </Dropzone>

                        <AddContainer>
                            <AddButton
                                onClick={() => {
                                    setSelectedTask({});
                                    setShowTask(true);
                                }}
                            />
                        </AddContainer>
                    </Board>
                    <Board>
                        <header>Fazendo</header>
                        <Dropzone>
                            {doing.map((task) => (
                                <Task
                                    key={task.id}
                                    {...task}
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setShowTask(true);
                                    }}
                                />
                            ))}
                        </Dropzone>
                    </Board>
                    <Board>
                        <header>Concluídas</header>
                        <Dropzone>
                            {done.map((task) => (
                                <Task
                                    key={task.id}
                                    {...task}
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setShowTask(true);
                                    }}
                                />
                            ))}
                        </Dropzone>
                    </Board>
                </Boards>
            </Container>
        </>
    );
};

export default Index;
