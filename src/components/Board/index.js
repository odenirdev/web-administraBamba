import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";
import { FaEdit, FaTasks } from "react-icons/fa";

import { Input } from "../../components/Form";
import Modal from "../../components/Modal";
import AddButton from "../../components/AddButton";
import Task from "../../components/Task";
import SpinnerLoader from "../../components/SpinnerLoader";

import TaskModal from "../../modals/Task";
import BoardModal from "../../modals/Board";

const Container = Styled.div``;

const Header = Styled.header.attrs({
    className: "row",
})`
`;

const AddContainer = Styled.div`
display: flex;
flex-direction: row-reverse;
padding: 0.5rem;
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
    background-color: var(--gray-6);
    border: 1px solid var(--color-primary);
    box-shadow: var(--shadow);
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

function Index({ board = {}, me = {}, indexBoard, indexTasks }) {
    const [data, setData] = useState({});

    const [showTask, setShowTask] = useState(false);

    const [showBoard, setShowBoard] = useState(false);

    const [selectedTask, setSelectedTask] = useState({});

    const [search, setSearch] = useState("");

    const [overDue, setOverDue] = useState([]);

    const [tasks, setTasks] = useState([]);

    const [doing, setDoing] = useState([]);

    const [done, setDone] = useState([]);

    const [filteredTasks, setFilteredTasks] = useState([]);

    useEffect(() => {
        if (Object.keys(board).length !== 0) {
            setData(board);
        }
    }, [board]);

    useEffect(() => {
        if (Array.isArray(board.tasks)) {
            if (search) {
                const filteredTasks = board.tasks.filter((task) => {
                    return (
                        task.title.includes(search) ||
                        new Date(task.created_at)
                            .toLocaleDateString()
                            .includes(search) ||
                        new Date(task.dueDate)
                            .toLocaleDateString()
                            .includes(search)
                    );
                });

                setFilteredTasks(filteredTasks);
            } else {
                setFilteredTasks(board.tasks);
            }
        }
    }, [board, search]);

    useEffect(() => {
        const tasks = filteredTasks.filter(
            (task) => task.status === 1 && !isOverDue(task.dueDate)
        );

        const overDue = filteredTasks.filter(
            (task) => task.status === 1 && isOverDue(task.dueDate)
        );

        const doing = filteredTasks.filter((task) => task.status === 2);

        const done = filteredTasks.filter((task) => task.status === 3);

        setTasks(tasks);
        setDoing(doing);
        setDone(done);
        setOverDue(overDue);
    }, [filteredTasks]);

    function isOverDue(date) {
        if (!date) {
            return false;
        }

        let formmatDate = new Date(date).toISOString();
        formmatDate = formmatDate.slice(0, formmatDate.indexOf("T"));
        formmatDate = `${formmatDate}T23:59:59`;

        let formmatToday = new Date().toISOString();
        formmatToday = formmatToday.slice(0, formmatToday.indexOf("T"));
        formmatToday = `${formmatToday}T23:59:59`;

        const dueDate = new Date(formmatDate).getTime();
        const today = new Date(formmatToday).getTime();
        return dueDate < today;
    }

    if (Object.keys(data).length === 0 || !me) {
        return <SpinnerLoader />;
    }

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
                    task={selectedTask}
                    idBoard={data.id}
                    index={indexTasks}
                    onClose={() => {
                        setShowTask(false);
                        setSelectedTask({});
                    }}
                />
            </Modal>
            <Modal
                show={showBoard}
                title={`Quadro ${data.title}`}
                onClose={() => {
                    setShowBoard(false);
                    setSelectedTask({ users: [] });
                }}
            >
                <BoardModal
                    board={data}
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
                            <span>{data.title}</span>
                        </Title>
                        <Description>
                            <h3>Descrição</h3>
                            <span>{data.description}</span>
                        </Description>
                        {data.id && (
                            <FaEdit
                                size={27}
                                onClick={() => setShowBoard(true)}
                            />
                        )}
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
                        <header>Atrasadas</header>
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
                        <header>Pendentes</header>
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

                        {data.id && (
                            <AddContainer>
                                <AddButton
                                    onClick={() => {
                                        setSelectedTask({});
                                        setShowTask(true);
                                    }}
                                    Icon={FaTasks}
                                />
                            </AddContainer>
                        )}
                    </Board>
                    <Board>
                        <header>Em progresso</header>
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
}

export default Index;
