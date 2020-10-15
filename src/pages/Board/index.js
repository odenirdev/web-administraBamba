import React, { useState, useEffect, useCallback } from "react";

import Container from "../../components/Container";
import Board from "../../components/Board";

import Api from "../../services/api";

import { Error } from "../../modules/notifications";

const Index = ({ match }) => {
    const [board, setBoard] = useState({});

    const indexTasks = useCallback(() => {
        async function indexTasks() {
            try {
                const response = await Api.get(
                    `/tasks?_limit=-1&board=${board.id}`
                );

                let serializedBoard = { ...board, tasks: response.data };

                if (JSON.stringify(serializedBoard) !== JSON.stringify(board)) {
                    setBoard(serializedBoard);
                }
            } catch (error) {
                Error(error);
            }
        }

        if (Object.keys(board).length !== 0) {
            indexTasks();
        }
    }, [board]);

    useEffect(() => {
        indexTasks();
    }, [indexTasks]);

    const indexBoard = useCallback(() => {
        async function show() {
            try {
                const { id } = match.params;
                const responseBoard = await Api.get(`/boards/${id}`);
                let board = responseBoard.data;

                setBoard(board);
            } catch (error) {
                Error(error);
            }
        }

        show();
    }, [match.params]);

    useEffect(() => {
        indexBoard();
    }, [indexBoard]);

    return (
        <Container>
            <Board
                board={board || {}}
                indexBoard={indexBoard}
                indexTasks={indexTasks}
            />
        </Container>
    );
};

export default Index;
