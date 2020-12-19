import React, { useContext, useEffect, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

import { Container, FormSendMessage, MessagesGrid } from "./styles";
import Input from "../Input";
import Message from "../Message";

import Firebase from "../../services/firebase";

import { Error } from "../../modules/notifications";

import AuthContext from "../../components/AuthContext";

function Index({ id, users }) {
    const {
        auth: { me },
    } = useContext(AuthContext);

    const [messages, setMessages] = useState([]);

    const [data, setData] = useState("");

    useEffect(() => {
        const messageGrid = document.querySelector(".messages-grid");

        if (!messageGrid) return;

        messageGrid.scrollTo(0, messageGrid.scrollHeight);
    }, [messages]);

    useEffect(() => {
        function showMessages() {
            Firebase.child("messages").on("value", (snapshot) => {
                const values = snapshot.val();

                if (values === null) return;

                const messages = Object.keys(values).map((id) => ({
                    ...values[id],
                    id,
                }));

                const conversationMessages = messages.filter(
                    (message) => message.conversation === id
                );

                setMessages(conversationMessages);
            });
        }

        showMessages();
    }, [id]);

    function handleSubmit(e) {
        e.preventDefault();
        try {
            const pushData = {
                message: data,
                from: me.id,
                conversation: id,
                saw: false,
                createdAt: new Date().toISOString(),
            };

            Firebase.child("messages").push(pushData, (error) => {
                if (error) {
                    throw error;
                }
            });

            const to = users.filter((user) => user !== me.id)[0];

            Firebase.child("notifications").push(
                {
                    title: "Nova Mensagem",
                    description: `Você recebeu uma nova mensagem de "${me.username}"`,
                    saw: false,
                    to_url: `/conversations/${id}`,
                    to,
                },
                (error) => {
                    if (error) {
                        Error(error);
                    }
                }
            );

            setData("");
        } catch (error) {
            Error(error);
        }
    }

    return (
        <Container>
            {id && (
                <>
                    <MessagesGrid>
                        {messages.map((item) => (
                            <Message
                                key={item.id}
                                message={item.message}
                                send={item.from === me.id}
                                createdAt={item.createdAt}
                            />
                        ))}
                    </MessagesGrid>
                    <FormSendMessage onSubmit={handleSubmit}>
                        <Input
                            value={data}
                            onChange={(event) => setData(event.target.value)}
                        />
                        <button type="submit">
                            <FaPaperPlane />
                        </button>
                    </FormSendMessage>
                </>
            )}
        </Container>
    );
}

export default Index;
