import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import Styled from "styled-components";
import { Row } from "react-bootstrap";
import { FaClipboard } from "react-icons/fa";

import Container from "../../components/Container";
import AddButton from "../../components/AddButton";
import Board from "../../components/BoardIcon";
import { Input } from "../../components/Form";
import Modal from "../../components/Modal";

import BoardModal from "../../modals/Board";

import Api from "../../services/api";
import { Error } from "../../modules/notifications";

const Header = Styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
`;

const Section = Styled.section`
    padding: 0 0.2rem;
`;

const Boards = Styled(Row)`
    & h1 {
        width: 100%;
    }
`;

const Index = () => {
    const history = useHistory();

    const [search, setSearch] = useState("");

    const [me, setMe] = useState({});

    const [show, setShow] = useState(false);

    const [board, setBoard] = useState({});

    const [title, setTitle] = useState("Novo Quadro");

    const [myBoards, setMyBoards] = useState([]);

    const [contributeBoards, setContributeBoards] = useState([]);

    const [filteredMyBoards, setFilteredMyBoards] = useState([]);

    const [filteredContributeBoards, setFilteredContributeBoards] = useState(
        []
    );

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

    const index = useCallback(() => {
        async function index() {
            try {
                if (me.id) {
                    const responseMyBoards = await Api.get(
                        `/boards?_limit=-1&creator=${me.id}`
                    );

                    const responseContributing = await Api.get(
                        `/boards?_limit=-1&users_in=${me.id}`
                    );

                    setContributeBoards(responseContributing.data);

                    setMyBoards(responseMyBoards.data);
                }
            } catch (error) {
                Error(error);
            }
        }

        index();
    }, [me.id]);

    useEffect(() => {
        if (search) {
            const filteredMyBoard = myBoards.filter(
                (board) =>
                    board.title.includes(search) ||
                    board.description.includes(search)
            );

            setFilteredMyBoards(filteredMyBoard);

            const filteredContributeBoards = contributeBoards.filter(
                (board) =>
                    board.title.includes(search) ||
                    board.description.includes(search)
            );

            setFilteredContributeBoards(filteredContributeBoards);
        }
    }, [contributeBoards, myBoards, search]);

    useEffect(() => {
        index();
    }, [index]);

    const handleAdd = () => {
        setTitle("Novo Quadro");
        setBoard({});
        setShow(true);
    };

    return (
        <>
            {me.id && (
                <Modal
                    title={title}
                    show={show}
                    onClose={() => {
                        setShow(false);
                    }}
                >
                    <BoardModal
                        board={board}
                        createMeID={me.id}
                        index={index}
                        onClose={() => {
                            setShow(false);
                        }}
                    />
                </Modal>
            )}
            <Container>
                <Header>
                    <Input
                        value={search}
                        label="Pesquisar"
                        max-width="250px"
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <AddButton onClick={handleAdd} Icon={FaClipboard} />
                </Header>
                <Section>
                    <Boards>
                        <h1>Meus Quadros</h1>
                        {!search ? (
                            <>
                                {myBoards.length !== 0 ? (
                                    <>
                                        {myBoards.map((board) => (
                                            <Board
                                                key={board.id}
                                                {...board}
                                                onClick={() => {
                                                    history.push(
                                                        `/board/${board.id}`
                                                    );
                                                }}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <span>Você não possui nenhum quadro.</span>
                                )}
                            </>
                        ) : (
                            <>
                                {filteredMyBoards.length !== 0 ? (
                                    <>
                                        {filteredMyBoards.map((board) => (
                                            <Board
                                                key={board.id}
                                                {...board}
                                                onClick={() => {
                                                    history.push(
                                                        `/board/${board.id}`
                                                    );
                                                }}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <span>Você não possui nenhum quadro.</span>
                                )}
                            </>
                        )}
                    </Boards>

                    <Boards>
                        <h1>Contribuindo</h1>
                        {!search ? (
                            <>
                                {contributeBoards.length !== 0 ? (
                                    <>
                                        {contributeBoards.map((board) => (
                                            <Board
                                                {...board}
                                                key={board.id}
                                                onClick={() => {
                                                    history.push(
                                                        `/board/${board.id}`
                                                    );
                                                }}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <span>
                                        Você está contribuindo em nenhum quadro.
                                    </span>
                                )}
                            </>
                        ) : (
                            <>
                                {filteredContributeBoards.length !== 0 ? (
                                    <>
                                        {filteredContributeBoards.map(
                                            (board) => (
                                                <Board
                                                    {...board}
                                                    key={board.id}
                                                    onClick={() => {
                                                        history.push(
                                                            `/board/${board.id}`
                                                        );
                                                    }}
                                                />
                                            )
                                        )}
                                    </>
                                ) : (
                                    <span>
                                        Você está contribuindo em nenhum quadro.
                                    </span>
                                )}
                            </>
                        )}
                    </Boards>
                </Section>
            </Container>
        </>
    );
};

export default Index;
