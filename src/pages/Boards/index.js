import React, { useState, useEffect, useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";

import { FaClipboard } from "react-icons/fa";

import Container from "../../components/Container";
import AddButton from "../../components/AddButton";
import Board from "../../components/BoardIcon";
import { Input } from "../../components/Form";
import Modal from "../../components/Modal";

import AuthContext from "../../components/AuthContext";

import BoardModal from "../../modals/Board";

import Api from "../../services/api";
import { Error } from "../../modules/notifications";

import { Header, Section, Boards } from "./styles";

const Index = () => {
    const history = useHistory();

    const [search, setSearch] = useState("");

    const [show, setShow] = useState(false);

    const [title, setTitle] = useState("Novo Quadro");

    const [myBoards, setMyBoards] = useState([]);

    const [contributeBoards, setContributeBoards] = useState([]);

    const [filteredMyBoards, setFilteredMyBoards] = useState([]);

    const [filteredContributeBoards, setFilteredContributeBoards] = useState(
        []
    );

    const {
        auth: { me },
    } = useContext(AuthContext);

    const index = useCallback(() => {
        async function index() {
            try {
                if (me.id) {
                    const responseMyBoards = await Api.get(
                        `/boards?_limit=-1&deleted=false&creator=${me.id}`
                    );

                    const responseContributing = await Api.get(
                        `/boards?_limit=-1&deleted=false&users_in=${me.id}`
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
                    <AddButton
                        onClick={handleAdd}
                        Icon={FaClipboard}
                        title="Cadastrar quadro"
                    />
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
