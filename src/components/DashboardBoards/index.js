import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { FaFolder } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import { isOverDue } from "../../pages/Board";

import Table, { ResponsiveTable } from "../Table";

import { Error } from "../../modules/notifications";
import DataTables from "../../modules/datatables";
import api from "../../services/api";

import { Container } from "./styles";

function Index() {
    const [data, setData] = useState([]);

    const history = useHistory();

    const setReactComponentinTable = useCallback(() => {
        const handleEdit = (id) => {
            history.push(`/board/${id}`);
        };

        const setReactComponentinTable = () => {
            const editarEls = document.querySelectorAll(".editar");

            for (const editarEl of editarEls) {
                ReactDOM.render(
                    <FaFolder
                        className="open-icon"
                        onClick={() => {
                            handleEdit(editarEl.dataset.id);
                        }}
                    />,
                    document.getElementById(editarEl.id)
                );
            }
        };

        setReactComponentinTable();
    }, [history]);

    useEffect(() => {
        const serializedData = data.map((item) => {
            const {
                id,
                creator: { username: creator },
                description,
                tasks,
                title,
            } = item;

            const pending = tasks.filter(
                (task) => task.status === 1 && !isOverDue(task.dueDate)
            );

            const overDue = tasks.filter(
                (task) =>
                    task.status === 0 ||
                    (task.status === 1 && isOverDue(task.dueDate))
            );

            const inProgress = tasks.filter((task) => task.status === 2);

            const done = tasks.filter((task) => task.status === 3);

            return {
                id,
                description,
                title,
                creator,
                tasks: tasks.length,
                pending: pending.length,
                overDue: overDue.length,
                inProgress: inProgress.length,
                done: done.length,
                open: `<div class="editar" data-id="${id}" id="editar-${id}"></div>`,
            };
        });

        DataTables(
            "#boards-table",
            serializedData,
            [
                { title: "Título", data: "title" },
                { title: "Descrição", data: "description" },
                { title: "Dono", data: "creator" },
                { title: "Tarefas", data: "tasks" },
                { title: "Atrasadas", data: "overDue" },
                { title: "Pendentes", data: "pending" },
                { title: "Em Progresso", data: "inProgress" },
                { title: "Concluídas", data: "done" },
                { title: "Abrir", data: "open" },
            ],
            () => {
                setReactComponentinTable();
            }
        );
    }, [data, setReactComponentinTable]);

    useEffect(() => {
        async function index() {
            try {
                const { data } = await api.get(
                    `/boards?_limit=-1&deleted=false`
                );

                setData(data);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, []);

    return (
        <Container>
            <h2>Quadros</h2>
            <ResponsiveTable>
                <Table id="boards-table"></Table>
            </ResponsiveTable>
        </Container>
    );
}

export default Index;
