import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import { Container, List } from "./styles";

import SelectedConversation from "../SelectedConversation";
import Conversation from "../Conversation";

import Context from "./context";

function Index({ selected }) {
    const history = useHistory();

    const conversations = useContext(Context);

    const [show, setShow] = useState(false);

    const [selectedConversation, setSelectedConversation] = useState({});

    useEffect(() => {
        setSelectedConversation(
            conversations.filter(
                (conversation) => conversation.id === selected
            )[0]
        );
    }, [conversations, selected]);

    return (
        <Container>
            <List {...{ show }}>
                <header>
                    <h1>Conversas</h1>
                    <i onClick={() => setShow(!show)}>
                        {show ? (
                            <FaCaretUp size={24} />
                        ) : (
                            <FaCaretDown size={24} />
                        )}
                    </i>
                </header>
                <ul>
                    {conversations.map((conversation) => (
                        <li key={conversation.id}>
                            <Conversation
                                {...conversation}
                                selected={conversation.id === selected}
                                onClick={() => {
                                    history.push(
                                        `/conversations/${conversation.id}`
                                    );
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </List>
            <SelectedConversation {...selectedConversation} />
        </Container>
    );
}

export default Index;
