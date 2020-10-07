import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import { FaFolder } from "react-icons/fa";
import { useHistory } from "react-router-dom";

import Table from "../Table";

import { Error } from "../../modules/notifications";
import Api from "../../services/api";

const Container = Styled.div`
    width: 80%;
    margin: 1rem auto;
`;

const Index = () => {
    const history = useHistory();

    const [data, setData] = useState([]);

    useEffect(() => {
        async function index() {
            try {
                const response = await Api.get("/boards?_limit=-1");

                let serializedData = response.data.map((data) => {
                    const inProgress = data.tasks.filter(
                        (task) => task.status === 2
                    ).length;

                    const done = data.tasks.filter((task) => task.status === 3)
                        .length;

                    const tasks = data.tasks.length;

                    let users = "";
                    for (const user of data.users) {
                        if (!users) {
                            users = user.username;
                        } else {
                            users = `${users}, ${user.username}`;
                        }
                    }

                    return {
                        ...data,
                        inProgress,
                        done,
                        tasks,
                        creator: data.creator.username,
                        users,
                    };
                });

                setData(serializedData);
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, []);

    return (
        <Container>
            <hr />
            <header>
                <h1>Relatório de Quadros</h1>
            </header>
            <Table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Descrição</th>
                        <th>Tarefas</th>
                        <th>Em progresso</th>
                        <th>Concluídas</th>
                        <th>Criador</th>
                        <th>Contribuidores</th>
                        <th>Abrir</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((board) => (
                        <tr key={board.id}>
                            <td>{board.title}</td>
                            <td>{board.description}</td>
                            <td>{board.tasks}</td>
                            <td>{board.inProgress}</td>
                            <td>{board.done}</td>
                            <td>{board.creator}</td>
                            <td>{board.users}</td>
                            <td className="folder d-flex justify-content-center">
                                <FaFolder
                                    onClick={() => {
                                        history.push(`/board/${board.id}`);
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Index;
