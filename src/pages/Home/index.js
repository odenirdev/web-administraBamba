import React, { useEffect, useState, useCallback } from "react";
import Styled from "styled-components";
import { Col } from "react-bootstrap";

import Container from "../../components/Container";
import { Input } from "../../components/Form";
import Task from "../../components/Task";
import Modal from "../../components/Modal";
import Table from "../../components/TableAdmin";
import Img from "../../components/Img";
import Spinner, { Container as ContainerSpinner } from "../../components/SpinnerLoader";

import TaskModal from "../../modals/Task";

import Api from "../../services/api";

import SchoolFail from "../../pages/SchoolFail";
import RegisterSchool from "../../pages/RegisterSchool";

import ADSAMBAIcon from "../../assets/images/adsamba-logo.png";

const Header = Styled.header.attrs({
    className: "row",
})`
`;

const Information = Styled(Col)`
    position: relative;
    padding: 1rem;

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
    box-shadow: var(--shadow);
    padding: 1rem;

    @media (max-width: 750px) {
        flex-direction: column;
    }
`;

const Board = Styled.div`
    background-color: var(--gray-6);
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
    max-height: 500px;
    min-height: 200px;
    overflow-y: auto;

    transition: 400ms;
`;

const Index = () => {
    const [statusSchool, setStatusSchool] = useState(0);

    const [me, setMe] = useState(0);

    const [search, setSearch] = useState("");

    const [allTasks, setAllTasks] = useState([]);

    const [filteredTasks, setFilteredTasks] = useState([]);

    const [selectedTask, setSelectedTask] = useState([]);

    const [showTask, setShowTask] = useState(false);

    const [overDue, setOverDue] = useState([]);

    const [tasks, setTasks] = useState([]);

    const [doing, setDoing] = useState([]);

    const [done, setDone] = useState([]);

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

    const indexTasks = useCallback(() => {
        async function indexTasks() {
            try {
                const response = await Api.get(
                    `/tasks?_limit=-1&users_in=${me.id}`
                );

                setAllTasks(response.data);
            } catch (error) {
                Error(error);
            }
        }

        indexTasks();
    }, [me.id]);

    useEffect(() => {
        indexTasks();
    }, [indexTasks]);

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

    function isOverDue(date) {
        if (!date) {
            return false;
        }
        const dueDate = new Date(new Date(date).toLocaleDateString()).getTime();
        const today =  new Date(new Date().toLocaleDateString()).getTime()
        return (dueDate < today);
    }

    if (!me && statusSchool === 0) {
        return <ContainerSpinner>
            <Img src={ADSAMBAIcon} width="250px"/>
            <Spinner />
        </ContainerSpinner>
    }

    if (statusSchool === 2) {
        return <SchoolFail />;
    }

    if (statusSchool === 1) {
        return <RegisterSchool />;
    }

    return (
        <>
            <Modal
                show={showTask}
                onClose={() => {
                    setShowTask(false);
                    setSelectedTask({});
                }}
                title={
                    Object.keys(selectedTask).length === 0
                        ? "Nova Tarefa"
                        : `Tarefa ${selectedTask.title}`
                }
            >
                <TaskModal
                    id={selectedTask.id}
                    me={me}
                    index={indexTasks}
                    onClose={() => {
                        setShowTask(false);
                        setSelectedTask({});
                    }}
                />
            </Modal>
            <Container outChild={me.role === 4 && <Table />}>
                <Header sm="12" md="8">
                    <Information>
                        <Title>
                            <h3>Título</h3>
                            <span>Minhas Tarefas</span>
                        </Title>
                        <Description>
                            <h3>Descrição</h3>
                            <span>
                                Lista das tarefas que você contribui
                            </span>
                        </Description>
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
