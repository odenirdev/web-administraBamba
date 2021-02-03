import React, { useState } from "react";
import { MdAdd } from "react-icons/md";

import { Container } from "./styles";

import Modal from "../Modal";
import Task from "../Task";
import ListEntry from "../ListEntry";

import TaskModal from "../../modals/Task";

function List({ data, index: indexList }) {
    const [showTask, setShowTask] = useState(false);

    const [selectedTask, setSelectedTask] = useState({});

    return (
        <>
            <Modal
                show={showTask}
                onClose={() => {
                    setShowTask(false);
                    setSelectedTask({ id: "" });
                }}
                title={
                    Object.keys(selectedTask).length === 0
                        ? "Nova Tarefa"
                        : `Tarefa ${selectedTask.title}`
                }
            >
                <TaskModal
                    id={selectedTask.id}
                    onClose={() => {
                        setShowTask(false);
                        setSelectedTask({ id: "" });
                    }}
                />
            </Modal>
            <Container>
                <header>
                    <h2>{data.title}</h2>
                    {data.creatable && (
                        <button
                            onClick={() => {
                                setShowTask(true);
                                setSelectedTask({});
                            }}
                            title="Cadastrar Tarefa"
                        >
                            <MdAdd size={24} color="#FFF" />
                        </button>
                    )}
                </header>

                {Array.isArray(data.tasks) && (
                    <ul>
                        {data.tasks.map((task, index) => (
                            <Task
                                key={task.id}
                                index={index}
                                data={task}
                                indexList={indexList}
                                onClick={() => {
                                    setShowTask(true);
                                    setSelectedTask(task);
                                }}
                            />
                        ))}
                    </ul>
                )}

                <ListEntry indexList={indexList} />
            </Container>
        </>
    );
}

export default List;
