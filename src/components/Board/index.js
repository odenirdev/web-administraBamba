import React, { useState, useContext } from "react";
import { FaEdit } from "react-icons/fa";

import Modal from "../../components/Modal";
import SpinnerLoader from "../../components/SpinnerLoader";
import List from "../../components/List";

import BoardContext from "./context";

import BoardModal from "../../modals/Board";

import { Container, Title, Description, Header, Information } from "./styles";

function Index() {
    const [showBoard, setShowBoard] = useState(false);

    const { data } = useContext(BoardContext);

    if (Object.keys(data).length === 0) {
        return <SpinnerLoader />;
    }

    return (
        <>
            <Modal
                show={showBoard}
                title={`Quadro ${data.title}`}
                onClose={() => {
                    setShowBoard(false);
                }}
            >
                <BoardModal
                    onClose={() => {
                        setShowBoard(false);
                    }}
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
                </Header>
                <section className="board-lists">
                    {Array.isArray(data.lists) &&
                        data.lists.map((list, index) => (
                            <List key={index} data={list} index={index} />
                        ))}
                </section>
            </Container>
        </>
    );
}

export default Index;
