import React, { useState, useEffect, useCallback } from "react";
import produce from "immer";

import Container from "../../components/Container";
import Board from "../../components/Board";

import BoardContext from "../../components/Board/context";

import Api from "../../services/api";

import { Error } from "../../modules/notifications";

const Index = ({ match }) => {
    const [data, setData] = useState({});

    const { id } = match.params;

    function move(fromList, toList, from, to) {
        setData(
            produce(data, (draft) => {
                const dragged = draft.lists[fromList].tasks[from];

                draft.lists[fromList].tasks.splice(from, 1);
                draft.lists[toList].tasks.splice(to, 0, dragged);
            })
        );
    }

    function sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return x < y ? -1 : x > y ? 1 : 0;
        });
    }

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

    const index = useCallback(() => {
        async function show() {
            try {
                const response = await Api.get(`/boards/${id}`);

                let {
                    title,
                    description,
                    creator: { id: creator },
                    tasks,
                    users,
                } = response.data;

                let board = {
                    id,
                    title,
                    description,
                    creator,
                    users,
                    lists: [
                        {
                            title: "Atrasadas",
                            creatable: false,
                            done: false,
                            tasks: sortByKey(
                                tasks.filter(
                                    (task) =>
                                        (task.status === 0 ||
                                            (task.status === 1 &&
                                                isOverDue(task.dueDate))) &&
                                        task.deleted === false
                                ),
                                "position"
                            ),
                        },
                        {
                            title: "Pendentes",
                            creatable: true,
                            done: false,
                            tasks: sortByKey(
                                tasks.filter(
                                    (task) =>
                                        task.status === 1 &&
                                        !isOverDue(task.dueDate) &&
                                        task.deleted === false
                                ),
                                "position"
                            ),
                        },
                        {
                            title: "Em progresso",
                            creatable: false,
                            done: false,
                            tasks: sortByKey(
                                tasks.filter(
                                    (task) =>
                                        task.status === 2 &&
                                        task.deleted === false
                                ),
                                "position"
                            ),
                        },
                        {
                            title: "Concluídas",
                            creatable: false,
                            done: false,
                            tasks: sortByKey(
                                tasks.filter(
                                    (task) =>
                                        task.status === 3 &&
                                        task.deleted === false
                                ),
                                "position"
                            ),
                        },
                    ],
                };

                setData(board);
            } catch (error) {
                Error(error);
            }
        }

        show();
    }, [id]);

    useEffect(() => {
        index();
    }, [index]);

    useEffect(() => {
        function setPositions() {
            if (Array.isArray(data.lists)) {
                data.lists.forEach((list, indexList) => {
                    list.tasks.forEach(async (task, index) => {
                        let updateData = {};

                        if (task.status !== indexList) {
                            updateData = { status: indexList };
                        }

                        if (task.position !== index) {
                            updateData = { ...updateData, position: index };
                        }

                        if (Object.keys(updateData).length !== 0) {
                            await Api.put(`/tasks/${task.id}`, updateData);
                        }
                    });
                });
            }
        }

        setPositions();
    }, [data.lists]);

    return (
        <BoardContext.Provider value={{ data, setData, move, index }}>
            <Container>
                <Board />
            </Container>
        </BoardContext.Provider>
    );
};

export default Index;
