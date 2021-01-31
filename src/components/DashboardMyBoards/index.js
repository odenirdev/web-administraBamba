import React, { useEffect, useContext, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { FaFolder, FaClipboard } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import AuthContext from "../AuthContext";
import { isOverDue } from "../../pages/Board";
import Table, { ResponsiveTable } from "../Table";
import CircleButton from "../CircleButton";

import { Error } from "../../modules/notifications";
import DataTables from "../../modules/datatables";
import api from "../../services/api";

import { Container } from "./styles";

function Index() {
    const {
        auth: { me },
    } = useContext(AuthContext);

    const history = useHistory();

    const [data, setData] = useState([]);

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

            const filteredTasks = tasks.filter((task) => !task.deleted);

            const pending = filteredTasks.filter(
                (task) => task.status === 1 && !isOverDue(task.dueDate)
            );

            const overDue = filteredTasks.filter(
                (task) =>
                    task.status === 0 ||
                    (task.status === 1 && isOverDue(task.dueDate))
            );

            const inProgress = filteredTasks.filter(
                (task) => task.status === 2
            );

            const done = filteredTasks.filter((task) => task.status === 3);

            return {
                id,
                description,
                title,
                creator,
                tasks: filteredTasks.length,
                pending: pending.length,
                overDue: overDue.length,
                inProgress: inProgress.length,
                done: done.length,
                open: `<div class="editar" data-id="${id}" id="editar-${id}"></div>`,
            };
        });

        DataTables(
            "#my-boards-table",
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
                const responseMyBoards = await api.get(
                    `/boards?_limit=-1&deleted=false&creator=${me.id}`
                );

                const responseContributing = await api.get(
                    `/boards?_limit=-1&deleted=false&users_in=${me.id}`
                );

                setData([
                    ...responseMyBoards.data,
                    ...responseContributing.data,
                ]);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, [me.id]);

    return (
        <Container>
            <header className="col-12">
                <h2>Meus Quadros</h2>
                <CircleButton
                    Icon={FaClipboard}
                    title="Meus Quadros"
                    onClick={() => {
                        history.push("/boards");
                    }}
                />
            </header>
            <ResponsiveTable>
                <Table id="my-boards-table"></Table>
            </ResponsiveTable>
        </Container>
    );
}

export default Index;
